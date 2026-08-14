import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { profileCompletion, useStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { listMyDocuments, getMyGigscore } from "@/lib/demo-api";
import riderImg from "@/assets/gig-delivery-rider.jpg";
import autoImg from "@/assets/gig-auto-driver.jpg";
import courierImg from "@/assets/gig-courier.jpg";
import groceryImg from "@/assets/gig-grocery.jpg";
import constructionImg from "@/assets/gig-construction.jpg";
import cabImg from "@/assets/gig-cab-driver.jpg";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const { profile } = useStore();
  const pct = profileCompletion(profile);
  const docs = useQuery({ queryKey: ["docs"], queryFn: () => listMyDocuments(), enabled: !!profile });
  const gig = useQuery({ queryKey: ["gigscore"], queryFn: () => getMyGigscore(), enabled: !!profile });
  const verified = (docs.data ?? []).filter((d) => d.status === "verified").length;
  const totalDocs = Math.max(docs.data?.length ?? 0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl gradient-hero p-6 text-white shadow-elevated sm:p-8"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
              ShramSethu
            </span>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome, {profile?.fullName?.split(" ")[0] ?? "Worker"}
            </h1>
            <p className="mt-1 max-w-xl text-sm text-white/85 sm:text-base">
              Let's continue building your verified digital work identity.
            </p>
          </div>
          <BadgeCheck className="hidden h-10 w-10 shrink-0 text-white sm:block" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatChip label="Profile completion" value={`${pct}%`} sub={pct < 100 ? "Keep going" : "Complete"} />
          <StatChip label="Verification" value={`${verified}/${totalDocs}`} sub="Documents verified" />
            <StatChip label="GigScore" value={gig.data?.score ? `${gig.data.score}/500` : "—"} sub={gig.data?.score ? "Verified" : "Awaiting activity"} />
        </div>
      </motion.div>

      {/* Profile completion */}
      {pct < 100 && (
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl gradient-soft text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="truncate text-sm font-semibold">Finish your profile to unlock GigScore</h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Add more work details to improve visibility to employers and lenders.</p>
            </div>
            <Button asChild size="sm" className="shrink-0 rounded-full gradient-primary text-white">
              <Link to="/app/profile">Continue <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          <Progress value={pct} className="mt-4 h-2" />
        </div>
      )}

      {/* Gig worker showcase */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="overflow-hidden rounded-3xl border bg-card shadow-soft"
      >
        <div className="relative">
          <img
            src={cabImg}
            alt="Cab driver standing beside his taxi on a city road at sunrise"
            width={1600}
            height={912}
            loading="lazy"
            className="h-56 w-full object-cover sm:h-72 lg:h-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <h2 className="max-w-2xl text-xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
              Empowering Every Gig Worker
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-primary-foreground/85 sm:text-base">
              Build your financial identity, track your work, and unlock better opportunities with ShramSethu.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-6 lg:grid-cols-5">
          {[
            { src: riderImg, alt: "Food delivery rider on a motorcycle with an insulated delivery bag", caption: "Food delivery" },
            { src: courierImg, alt: "Courier worker carrying a parcel at a doorway", caption: "Courier & parcels" },
            { src: groceryImg, alt: "Grocery delivery worker carrying a crate of fresh vegetables", caption: "Grocery delivery" },
            { src: autoImg, alt: "Auto-rickshaw driver seated in his auto", caption: "Auto & cab driving" },
            { src: constructionImg, alt: "Construction daily-wage worker wearing a safety helmet at a site", caption: "Daily-wage work" },
          ].map((p) => (
            <figure key={p.caption} className="group overflow-hidden rounded-2xl border bg-background shadow-sm">
              <img
                src={p.src}
                alt={p.alt}
                width={1280}
                height={960}
                loading="lazy"
                className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-40"
              />
              <figcaption className="px-3 py-2 text-xs font-medium text-muted-foreground">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

function StatChip({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
      <div className="text-[11px] font-medium uppercase tracking-wider text-white/80">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      <div className="mt-0.5 text-[11px] text-white/75">{sub}</div>
    </div>
  );
}