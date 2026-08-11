import { createFileRoute } from "@tanstack/react-router";
import { Award, Info, Sparkles, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { getMyGigscore } from "@/lib/api.functions";

export const Route = createFileRoute("/app/gigscore")({
  component: GigScorePage,
});

function GigScorePage() {
  const { data } = useQuery({ queryKey: ["gigscore"], queryFn: () => getMyGigscore() });
  const score = data?.score;
  const locked = data?.reason === "profile_incomplete";
  const pct = Math.min(100, Math.round(((score ?? 0) / 500) * 100));
  const breakdown = (data?.breakdown ?? null) as Record<string, number> | null;
  const parts: { key: string; label: string; max: number }[] = [
    { key: "monthly_uploads", label: "Verified monthly uploads", max: 180 },
    { key: "consecutive_uploads", label: "Consecutive monthly uploads", max: 70 },
    { key: "documents", label: "Verified documents", max: 36 },
    { key: "consistency", label: "Earnings consistency", max: 50 },
    { key: "account_completion", label: "Account completion", max: 20 },
    { key: "identity_verification", label: "Identity verification", max: 25 },
    { key: "long_term_activity", label: "Long-term activity", max: 60 },
    { key: "income_history", label: "Reliable income history", max: 30 },
  ];
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reputation"
        title="GigScore"
        description="An AI-powered reputation score built from your verified work activity."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="relative overflow-hidden rounded-3xl border bg-card p-8 shadow-sm">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="flex flex-col items-center text-center">
            <div className="grid h-40 w-40 place-items-center rounded-full border-8 border-muted">
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient">{score ?? "—"}</div>
                <div className="text-xs font-medium text-muted-foreground">out of 500</div>
                <div className="mt-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">{score ? "Verified" : "Awaiting data"}</div>
              </div>
            </div>
            <div className="mt-6 w-full max-w-md">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                <span>0</span><span>{pct}%</span><span>500</span>
              </div>
            </div>
            <h3 className="mt-6 max-w-md text-base font-semibold">
              {score
                ? "Your GigScore reflects verified work activity."
                : locked
                  ? "Complete your Worker Profile to unlock your GigScore."
                  : "Upload and verify your income documents in Income Analytics to generate your GigScore."}
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {locked
                ? "All mandatory Worker Profile fields must be completed and saved before your GigScore section unlocks."
                : score
                  ? "Calculated only from verified income, earning consistency, verified work history and verified documents."
                  : "Upload and verify your income documents in Income Analytics to generate your GigScore."}
            </p>
          </div>
        </div>

        {breakdown && (
          <div className="rounded-3xl border bg-card p-6 shadow-sm lg:col-span-1">
            <h3 className="text-sm font-semibold">Score breakdown</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Your GigScore grows gradually — each verified month, streak and document adds a little more.
            </p>
            <div className="mt-4 space-y-3">
              {parts.map((p) => {
                const v = Number(breakdown[p.key] ?? 0);
                return (
                  <div key={p.key}>
                    <div className="flex items-center justify-between text-xs">
                      <span>{p.label}</span>
                      <span className="text-muted-foreground">{v}/{p.max}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (v / p.max) * 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <ExplainCard icon={Info} title="What is GigScore?" body="A single, portable reputation score out of 500 summarising your verified work identity across gigs and platforms." />
          <ExplainCard icon={Sparkles} title="How is it calculated?" body="From verified monthly income uploads, consecutive upload streaks, earnings consistency, verified documents, identity verification and long-term platform activity." />
          <ExplainCard icon={Award} title="Benefits" body="Higher GigScore improves visibility to employers, unlocks fairer loan offers and priority access to schemes." />
          <ExplainCard icon={TrendingUp} title="Grows over time" body="One upload adds only a little. Around 20-40 after your first verified month, 120-200 after six, and 400+ only for long-term consistent workers." />
        </div>
      </div>
    </div>
  );
}

function ExplainCard({ icon: Icon, title, body }: { icon: typeof Info; title: string; body: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-soft text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="mt-0.5 text-xs text-muted-foreground">{body}</p>
        </div>
      </div>
    </div>
  );
}