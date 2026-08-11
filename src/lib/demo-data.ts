/**
 * Demo Mode dataset — the single source of truth for everything a judge sees.
 * Only July digital earnings exist (₹4,800 + ₹5,600 + ₹6,200 + ₹5,900 = ₹22,500).
 * These objects are local to the browser; nothing is written to the database.
 */
import { DEMO_REF_DATE, demoNow, readDemoStore, writeDemoStore } from "@/lib/demo";

export const DEMO_YEAR = 2026;
export const DEMO_MONTH = 7;
export const DEMO_TOTAL_JULY = 22500;

export const DEMO_WEEKS = [
  { label: "July Week 1", date: `${DEMO_YEAR}-07-07`, amount: 4800 },
  { label: "July Week 2", date: `${DEMO_YEAR}-07-14`, amount: 5600 },
  { label: "July Week 3", date: `${DEMO_YEAR}-07-21`, amount: 6200 },
  { label: "July Week 4", date: `${DEMO_YEAR}-07-28`, amount: 5900 },
] as const;

export type DemoProfile = {
  full_name: string; email: string; phone: string; category: string;
  skills: string; experience: string; location: string; work_type: string;
  languages: string; emergency_name: string; emergency_phone: string;
  photo_url: string | null; id_doc_name: string; onboarded: boolean; status: string;
};

const BASE_PROFILE: DemoProfile = {
  full_name: "Demo Worker",
  email: "demo@shramsethu.in",
  phone: "+91 90000 00000",
  category: "Delivery Partner",
  skills: "Two-wheeler delivery, Route planning, Customer handling",
  experience: "3 years",
  location: "Bengaluru, Karnataka",
  work_type: "Gig Worker / Delivery Partner",
  languages: "English, Hindi, Kannada",
  emergency_name: "Demo Contact",
  emergency_phone: "+91 90000 11111",
  photo_url: null,
  id_doc_name: "Aadhaar Card",
  onboarded: true,
  status: "online",
};

export function demoProfile(): DemoProfile {
  return { ...BASE_PROFILE, ...readDemoStore<Partial<DemoProfile>>("profile", {}) };
}

export function saveDemoProfile(patch: Record<string, unknown>) {
  const current = readDemoStore<Record<string, unknown>>("profile", {});
  writeDemoStore("profile", { ...current, ...patch });
}

export const DEMO_SETTINGS = { notifications: true, dark_mode: false, location_sharing: true, language: null };

// ---------- Documents ----------
export type DemoDoc = {
  id: string; kind: string; status: string; file_name: string; document_name: string;
  storage_path: string | null; mime_type: string; size_bytes: number;
  ocr_status: string; confidence_score: number | null; verification_reason: string | null;
  rejection_reason: string | null; ai_verified_at: string | null; verified_at: string | null;
  created_at: string; income_source: string | null; income_frequency: string | null;
  income_month: number | null; income_year: number | null;
  extracted_amount: number | null; extracted_date: string | null;
  extracted_employer: string | null; extracted_txn_ref: string | null;
  is_income_proof: boolean;
};

const stamp = (d: string) => `${d}T10:15:00.000Z`;

const INCOME_DOCS: DemoDoc[] = DEMO_WEEKS.map((w, i) => ({
  id: `demo-income-${i + 1}`,
  kind: "payment_receipt",
  status: "verified",
  file_name: `zomato-${w.label.toLowerCase().replace(/\s+/g, "-")}.png`,
  document_name: `Zomato · weekly · July ${DEMO_YEAR} · ${w.label}`,
  storage_path: null,
  mime_type: "image/png",
  size_bytes: 184320,
  ocr_status: "done",
  confidence_score: 96,
  verification_reason: "Platform earnings summary matched — payout amount, week and partner name are consistent.",
  rejection_reason: null,
  ai_verified_at: stamp(w.date),
  verified_at: stamp(w.date),
  created_at: stamp(w.date),
  income_source: "Zomato",
  income_frequency: "weekly",
  income_month: DEMO_MONTH,
  income_year: DEMO_YEAR,
  extracted_amount: w.amount,
  extracted_date: w.date,
  extracted_employer: "Zomato",
  extracted_txn_ref: `DEMOPAY${1000 + i}`,
  is_income_proof: true,
}));

const ID_DOCS: DemoDoc[] = [
  {
    id: "demo-aadhaar", kind: "aadhaar", status: "verified", file_name: "aadhaar.pdf",
    document_name: "Aadhaar Card", storage_path: null, mime_type: "application/pdf",
    size_bytes: 240000, ocr_status: "done", confidence_score: 97,
    verification_reason: "Aadhaar layout, UIDAI branding and holder details verified.",
    rejection_reason: null, ai_verified_at: stamp(`${DEMO_YEAR}-07-02`),
    verified_at: stamp(`${DEMO_YEAR}-07-02`), created_at: stamp(`${DEMO_YEAR}-07-02`),
    income_source: null, income_frequency: null, income_month: null, income_year: null,
    extracted_amount: null, extracted_date: null, extracted_employer: null,
    extracted_txn_ref: null, is_income_proof: false,
  },
  {
    id: "demo-pan", kind: "pan", status: "verified", file_name: "pan.pdf",
    document_name: "PAN Card", storage_path: null, mime_type: "application/pdf",
    size_bytes: 190000, ocr_status: "done", confidence_score: 95,
    verification_reason: "PAN format and Income Tax Department branding verified.",
    rejection_reason: null, ai_verified_at: stamp(`${DEMO_YEAR}-07-03`),
    verified_at: stamp(`${DEMO_YEAR}-07-03`), created_at: stamp(`${DEMO_YEAR}-07-03`),
    income_source: null, income_frequency: null, income_month: null, income_year: null,
    extracted_amount: null, extracted_date: null, extracted_employer: null,
    extracted_txn_ref: null, is_income_proof: false,
  },
];

export function demoDocs(): DemoDoc[] {
  const extra = readDemoStore<DemoDoc[]>("docs", []);
  return [...extra, ...INCOME_DOCS, ...ID_DOCS].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export function addDemoDoc(doc: DemoDoc) {
  writeDemoStore("docs", [doc, ...readDemoStore<DemoDoc[]>("docs", [])]);
}

export function patchDemoDoc(id: string, patch: Partial<DemoDoc>) {
  writeDemoStore(
    "docs",
    readDemoStore<DemoDoc[]>("docs", []).map((d) => (d.id === id ? { ...d, ...patch } : d)),
  );
}

export function removeDemoDoc(id: string) {
  writeDemoStore("docs", readDemoStore<DemoDoc[]>("docs", []).filter((d) => d.id !== id));
}

// ---------- Transactions ----------
export type DemoTxn = {
  id: string; type: string; amount: number; source: string | null; occurred_on: string;
  note: string | null; verified: boolean; document_id: string | null;
  frequency: string | null; confidence_score: number | null; created_at: string;
};

export function demoTxns(): DemoTxn[] {
  const extra = readDemoStore<DemoTxn[]>("txns", []);
  const base: DemoTxn[] = DEMO_WEEKS.map((w, i) => ({
    id: `demo-txn-${i + 1}`,
    type: "income",
    amount: w.amount,
    source: "Zomato",
    occurred_on: w.date,
    note: `${w.label} verified digital earnings`,
    verified: true,
    document_id: `demo-income-${i + 1}`,
    frequency: "weekly",
    confidence_score: 96,
    created_at: stamp(w.date),
  }));
  return [...extra, ...base].sort((a, b) => (a.occurred_on < b.occurred_on ? 1 : -1));
}

export function addDemoTxn(t: DemoTxn) {
  writeDemoStore("txns", [t, ...readDemoStore<DemoTxn[]>("txns", [])]);
}

// ---------- Notifications / work history ----------
export function demoNotifications() {
  return [
    { id: "demo-n1", title: "July earnings verified", body: "All 4 July earnings proofs passed AI verification.", created_at: stamp(`${DEMO_YEAR}-07-28`), read: false },
    { id: "demo-n2", title: "GigScore updated", body: "Your GigScore was recalculated from verified July activity.", created_at: stamp(`${DEMO_YEAR}-07-28`), read: false },
    { id: "demo-n3", title: "Identity verified", body: "Aadhaar and PAN verification completed.", created_at: stamp(`${DEMO_YEAR}-07-03`), read: true },
  ];
}

export function demoWorkHistory() {
  return [
    { id: "demo-w1", title: "Food delivery partner", employer: "Zomato", category: "Delivery Partner", started_on: `${DEMO_YEAR}-07-01`, ended_on: null },
  ];
}

// ---------- Emergency contacts (demo-local CRUD) ----------
export type DemoContact = { id: string; name: string; phone: string; relation: string | null; is_primary: boolean };

const BASE_CONTACTS: DemoContact[] = [
  { id: "demo-c1", name: "Demo Contact", phone: "+91 90000 11111", relation: "Family", is_primary: true },
];

export function demoContacts(): DemoContact[] {
  return readDemoStore<DemoContact[]>("contacts", BASE_CONTACTS);
}

export function saveDemoContact(c: { id?: string; name: string; phone: string; relation?: string; is_primary?: boolean }) {
  const list = demoContacts();
  if (c.id) {
    writeDemoStore(
      "contacts",
      list.map((x) => (x.id === c.id ? { ...x, name: c.name, phone: c.phone, relation: c.relation ?? null, is_primary: !!c.is_primary } : x)),
    );
  } else {
    writeDemoStore("contacts", [
      ...list,
      { id: `demo-c-${Date.now()}`, name: c.name, phone: c.phone, relation: c.relation ?? null, is_primary: !!c.is_primary },
    ]);
  }
}

export function deleteDemoContact(id: string) {
  writeDemoStore("contacts", demoContacts().filter((c) => c.id !== id));
}

// ---------- GigScore (mirrors the production recompute_gigscore weights) ----------
const DEMO_ACCOUNT_MONTHS = 8; // demo worker joined ~8 months before the demo date

export function demoGigscore() {
  const incomes = demoTxns().filter((t) => t.type === "income" && t.verified);
  if (incomes.length === 0) {
    return { score: null, verifiedCount: 0, breakdown: null, locked: false, missingFields: [], reason: "no_verified_income" as const };
  }
  const byMonth = new Map<string, number>();
  incomes.forEach((t) => {
    const k = t.occurred_on.slice(0, 7);
    byMonth.set(k, (byMonth.get(k) ?? 0) + t.amount);
  });
  const months = Array.from(byMonth.keys()).sort();
  const monthCount = months.length;

  // Longest consecutive monthly run.
  let streak = 1;
  for (let i = 1; i < months.length; i++) {
    const [py, pm] = months[i - 1].split("-").map(Number);
    const [cy, cm] = months[i].split("-").map(Number);
    if (cy * 12 + cm === py * 12 + pm + 1) streak += 1;
  }

  const totals = Array.from(byMonth.values());
  const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
  const variance = totals.reduce((a, b) => a + (b - avg) ** 2, 0) / totals.length;
  const cv = avg > 0 ? Math.min(Math.sqrt(variance) / avg, 1) : 1;

  const docs = demoDocs();
  const verifiedDocs = docs.filter((d) => d.status === "verified").length;
  const identityDocs = docs.filter(
    (d) => d.status === "verified" && ["aadhaar", "pan", "license", "identity", "passport", "voter_id"].includes(d.kind),
  ).length;

  const p = demoProfile();
  const profileFields = [p.full_name, p.email, p.phone, p.category, p.skills, p.location, p.work_type, p.languages]
    .filter((v) => !!v && String(v).trim() !== "").length;

  const maturity = Math.min(monthCount, 12) / 12;
  const sMonths = Math.min(monthCount * 12, 180);
  const sStreak = Math.min(Math.max(streak - 1, 0) * 6, 70);
  const sDocs = Math.min(verifiedDocs * 3, 36);
  const sConsistency = Math.round(50 * (1 - cv) * maturity);
  const sProfile = Math.round(20 * (profileFields / 8) * maturity);
  const sIdentity = Math.round((25 * Math.min(identityDocs, 2)) / 2 * maturity);
  const sActivity = Math.min(DEMO_ACCOUNT_MONTHS * 3, 60);
  const sHistory = Math.min(Math.round(incomes.length * 1.5), 30);

  const score = Math.min(
    sMonths + sStreak + sDocs + sConsistency + sProfile + sIdentity + sActivity + sHistory,
    500,
  );

  return {
    score,
    verifiedCount: incomes.length,
    breakdown: {
      max_score: 500,
      verified_months: monthCount,
      streak_months: streak,
      monthly_uploads: sMonths,
      consecutive_uploads: sStreak,
      documents: sDocs,
      consistency: sConsistency,
      account_completion: sProfile,
      identity_verification: sIdentity,
      long_term_activity: sActivity,
      income_history: sHistory,
      income_total: incomes.reduce((a, t) => a + t.amount, 0),
    },
    locked: false,
    missingFields: [] as string[],
    reason: null,
    computed_at: demoNow().toISOString(),
    ref_date: DEMO_REF_DATE,
  };
}
