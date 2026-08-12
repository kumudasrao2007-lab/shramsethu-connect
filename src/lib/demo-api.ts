/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Demo-aware data layer.
 *
 * Every worker screen imports its data functions from here instead of
 * `api.functions` directly. When Demo Mode is off these are the exact same
 * server functions; when it is on, all reads and writes are served from the
 * browser-local demo dataset so production data is never touched.
 */
import { supabase } from "@/integrations/supabase/client";
import * as api from "@/lib/api.functions";
import { demoNow, isDemo } from "@/lib/demo";
import * as D from "@/lib/demo-data";
import { demoListSchemes, demoNearbyPlaces } from "@/lib/demo.functions";

export type { DocKind } from "@/lib/api.functions";

type AnyFn = (...args: any[]) => any;

function wrap<T extends AnyFn>(real: T, demo: (...args: Parameters<T>) => any): T {
  return ((...args: Parameters<T>) =>
    isDemo() ? Promise.resolve(demo(...args)) : real(...args)) as unknown as T;
}

// ---------- Profile / settings ----------
export const getMyProfile = wrap(api.getMyProfile, () => ({
  profile: D.demoProfile(),
  settings: D.DEMO_SETTINGS,
  isAdmin: false,
}));

export const updateMyProfile = wrap(api.updateMyProfile, (opts: any) => {
  D.saveDemoProfile(opts?.data ?? {});
  return { ok: true };
});

export const updateMySettings = wrap(api.updateMySettings, () => ({ ok: true }));

// ---------- Documents ----------
export const listMyDocuments = wrap(api.listMyDocuments, () => D.demoDocs());

export const listMyIncomeUploads = wrap(api.listMyIncomeUploads, () =>
  D.demoDocs().filter((d) => d.is_income_proof),
);

export const recordDocument = wrap(api.recordDocument, (opts: any) => {
  const d = opts?.data ?? {};
  const id = `demo-up-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  D.addDemoDoc({
    id,
    kind: d.kind ?? "other",
    status: "pending",
    file_name: d.file_name ?? "document",
    document_name: d.document_name ?? d.file_name ?? "document",
    storage_path: null,
    mime_type: d.mime_type ?? "application/octet-stream",
    size_bytes: d.size_bytes ?? 0,
    ocr_status: "queued",
    confidence_score: null,
    verification_reason: null,
    rejection_reason: null,
    ai_verified_at: null,
    verified_at: null,
    created_at: demoNow().toISOString(),
    income_source: d.income_source ?? null,
    income_frequency: d.income_frequency ?? null,
    income_month: d.income_month ?? null,
    income_year: d.income_year ?? null,
    extracted_amount: null,
    extracted_date: null,
    extracted_employer: null,
    extracted_txn_ref: null,
    is_income_proof: !!d.is_income_proof,
  });
  return { ok: true, id };
});

export const analyzeDocument = wrap(api.analyzeDocument, (opts: any) => {
  const id: string = opts?.data?.id;
  const doc = D.demoDocs().find((x) => x.id === id);
  const when = demoNow().toISOString();
  const reason =
    "Demo Mode simulation — layout, branding and field consistency checks passed. No production data was written.";
  D.patchDemoDoc(id, {
    status: "verified",
    ocr_status: "done",
    confidence_score: 93,
    verification_reason: reason,
    ai_verified_at: when,
    verified_at: when,
  });
  return {
    ok: true,
    status: "verified" as const,
    confidence_score: 93,
    verification_reason: reason,
    kind: doc?.kind ?? "other",
  };
});

export const getMyDocumentUrl = wrap(api.getMyDocumentUrl, () => {
  throw new Error("Document previews are disabled in Demo Mode — sample files are not stored.");
});

export const deleteMyDocument = wrap(api.deleteMyDocument, (opts: any) => {
  D.removeDemoDoc(opts?.data?.id);
  return { ok: true };
});

/** Uploads the raw file to storage — a no-op in Demo Mode. */
export async function uploadDocumentFile(path: string, file: File) {
  if (isDemo()) return;
  const up = await supabase.storage.from("documents").upload(path, file, { upsert: false });
  if (up.error) throw up.error;
}

// ---------- Income / score / loan ----------
export const listMyTransactions = wrap(api.listMyTransactions, () => D.demoTxns());
export const getMyGigscore = wrap(api.getMyGigscore, () => D.demoGigscore());
export const getLoanEligibility = wrap(api.getLoanEligibility, () => ({
  eligible: true,
  amount: null,
  reason: null,
}));

// ---------- Dashboard ----------
export const listMyNotifications = wrap(api.listMyNotifications, () => D.demoNotifications());
export const listMyWorkHistory = wrap(api.listMyWorkHistory, () => D.demoWorkHistory());

// ---------- Schemes ----------
export const listSchemes = wrap(api.listSchemes, () => demoListSchemes());

// ---------- Location / maps ----------
export const recordLocation = wrap(api.recordLocation, () => ({ ok: true }));
export const nearbyPlaces = wrap(api.nearbyPlaces, (opts: any) => demoNearbyPlaces({ data: opts?.data }));

// ---------- SOS / emergency contacts ----------
export const triggerSOS = wrap(api.triggerSOS, () => ({ ok: true }));
export const listEmergencyContacts = wrap(api.listEmergencyContacts, () => D.demoContacts());
export const saveEmergencyContact = wrap(api.saveEmergencyContact, (opts: any) => {
  D.saveDemoContact(opts?.data ?? {});
  return { ok: true };
});
export const deleteEmergencyContact = wrap(api.deleteEmergencyContact, (opts: any) => {
  D.deleteDemoContact(opts?.data?.id);
  return { ok: true };
});