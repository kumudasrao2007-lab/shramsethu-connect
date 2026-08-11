CREATE OR REPLACE FUNCTION public.recompute_gigscore(_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  income_txns INT := 0;
  income_total NUMERIC := 0;
  month_count INT := 0;
  streak INT := 0;
  prev_month DATE;
  m DATE;
  avg_amt NUMERIC := 0;
  stddev_amt NUMERIC := 0;
  cv NUMERIC := 1;
  verified_docs INT := 0;
  identity_docs INT := 0;
  account_months INT := 0;
  profile_fields INT := 0;
  profile_total INT := 8;
  maturity NUMERIC := 0;
  s_months INT := 0;
  s_streak INT := 0;
  s_docs INT := 0;
  s_consistency INT := 0;
  s_profile INT := 0;
  s_identity INT := 0;
  s_activity INT := 0;
  s_history INT := 0;
  total INT;
  breakdown JSONB;
BEGIN
  IF auth.uid() IS NOT NULL
     AND auth.uid() <> _user_id
     AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT COUNT(*), COALESCE(SUM(amount), 0)
    INTO income_txns, income_total
    FROM public.transactions
    WHERE user_id = _user_id AND type = 'income' AND verified = TRUE;

  IF income_txns = 0 THEN
    RETURN NULL;
  END IF;

  -- Distinct verified income months (all-time) and the longest consecutive run.
  FOR m IN
    SELECT DISTINCT date_trunc('month', occurred_on)::date AS mm
    FROM public.transactions
    WHERE user_id = _user_id AND type = 'income' AND verified = TRUE
    ORDER BY 1
  LOOP
    month_count := month_count + 1;
    IF prev_month IS NOT NULL AND m = (prev_month + INTERVAL '1 month')::date THEN
      streak := streak + 1;
    ELSE
      streak := GREATEST(streak, 1);
    END IF;
    prev_month := m;
  END LOOP;
  streak := GREATEST(streak, 1);

  -- Earnings consistency: lower coefficient of variation on monthly totals = better.
  SELECT COALESCE(AVG(t), 0), COALESCE(STDDEV_POP(t), 0)
    INTO avg_amt, stddev_amt
    FROM (
      SELECT SUM(amount) AS t
      FROM public.transactions
      WHERE user_id = _user_id AND type = 'income' AND verified = TRUE
      GROUP BY date_trunc('month', occurred_on)
    ) q;
  IF avg_amt > 0 THEN
    cv := LEAST(stddev_amt / avg_amt, 1);
  END IF;

  SELECT COUNT(*) INTO verified_docs
    FROM public.documents WHERE user_id = _user_id AND status = 'verified';

  SELECT COUNT(*) INTO identity_docs
    FROM public.documents
    WHERE user_id = _user_id AND status = 'verified'
      AND kind IN ('aadhaar', 'pan', 'license', 'identity', 'passport', 'voter_id');

  SELECT GREATEST(0, (EXTRACT(EPOCH FROM (now() - created_at)) / 2592000)::INT),
         (CASE WHEN COALESCE(full_name, '') <> '' THEN 1 ELSE 0 END
          + CASE WHEN COALESCE(email, '') <> '' THEN 1 ELSE 0 END
          + CASE WHEN COALESCE(phone, '') <> '' THEN 1 ELSE 0 END
          + CASE WHEN category IS NOT NULL THEN 1 ELSE 0 END
          + CASE WHEN COALESCE(skills, '') <> '' THEN 1 ELSE 0 END
          + CASE WHEN COALESCE(location, '') <> '' THEN 1 ELSE 0 END
          + CASE WHEN COALESCE(work_type, '') <> '' THEN 1 ELSE 0 END
          + CASE WHEN COALESCE(languages, '') <> '' THEN 1 ELSE 0 END)
    INTO account_months, profile_fields
    FROM public.profiles WHERE id = _user_id;
  account_months := COALESCE(account_months, 0);
  profile_fields := COALESCE(profile_fields, 0);

  -- Trust maturity: static signals only count as verified history accumulates,
  -- so one upload can never unlock a large score.
  maturity := LEAST(month_count, 12)::NUMERIC / 12.0;

  s_months      := LEAST(month_count * 12, 180);              -- verified monthly uploads
  s_streak      := LEAST(GREATEST(streak - 1, 0) * 6, 70);    -- consecutive months
  s_docs        := LEAST(verified_docs * 3, 36);              -- AI/OCR verified documents
  s_consistency := ROUND(50 * (1 - cv) * maturity);           -- earnings consistency
  s_profile     := ROUND(20 * (profile_fields::NUMERIC / profile_total) * maturity);
  s_identity    := ROUND(25 * LEAST(identity_docs, 2)::NUMERIC / 2 * maturity);
  s_activity    := LEAST(account_months * 3, 60);             -- long-term activity
  s_history     := LEAST(ROUND(income_txns * 1.5)::INT, 30);  -- reliable income history

  total := LEAST(
    s_months + s_streak + s_docs + s_consistency + s_profile
      + s_identity + s_activity + s_history,
    500);

  breakdown := jsonb_build_object(
    'max_score', 500,
    'verified_months', month_count,
    'streak_months', streak,
    'monthly_uploads', s_months,
    'consecutive_uploads', s_streak,
    'documents', s_docs,
    'consistency', s_consistency,
    'account_completion', s_profile,
    'identity_verification', s_identity,
    'long_term_activity', s_activity,
    'income_history', s_history,
    'income_total', income_total
  );

  INSERT INTO public.gigscore_snapshots (user_id, score, breakdown, computed_at)
  VALUES (_user_id, total, breakdown, now());
  RETURN total;
END;
$function$;