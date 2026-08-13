import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft, CheckCircle2, ClipboardList, ExternalLink, FileText, HeartPulse, ListChecks, Target,
} from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { findHealthScheme } from "@/lib/health-schemes";

export const Route = createFileRoute("/app/schemes/$slug")({
  loader: ({ params }) => {
    const scheme = findHealthScheme(params.slug);
    if (!scheme) throw notFound();
    return { scheme };
  },
  component: SchemeDetailPage,
  notFoundComponent: SchemeNotFound,
});

function SchemeNotFound() {
  return (
    <div className="space-y-4">
      <PageHeader title="Scheme not found" description="This scheme is no longer in the catalogue." />
      <Button asChild variant="outline" className="rounded-full">
        <Link to="/app/schemes">Back to schemes</Link>
      </Button>
    </div>
  );
}

function Section({
  icon, title, children,
}: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl gradient-soft text-primary">{icon}</span>
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="mt-3 text-sm text-muted-foreground">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="min-w-0">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function SchemeDetailPage() {
  const { scheme } = Route.useLoaderData();
  const [openEligibility, setOpenEligibility] = useState(false);

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 rounded-full text-muted-foreground">
        <Link to="/app/schemes">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> All schemes
        </Link>
      </Button>

      <PageHeader
        eyebrow="Health Schemes for Gig Workers"
        title={scheme.name}
        description={scheme.summary}
        actions={
          <>
            <Button variant="outline" className="rounded-full" onClick={() => setOpenEligibility(true)}>
              Check Eligibility
            </Button>
            <Button asChild className="rounded-full gradient-primary text-white">
              <a href={scheme.url} target="_blank" rel="noopener noreferrer">
                Apply Now <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </a>
            </Button>
          </>
        }
      />

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
            <HeartPulse className="h-3 w-3" /> Health
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5">{scheme.authority}</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{scheme.description}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section icon={<Target className="h-4 w-4" />} title="Purpose">
          <p>{scheme.purpose}</p>
        </Section>
        <Section icon={<ListChecks className="h-4 w-4" />} title="Eligibility criteria">
          <Bullets items={scheme.eligibility} />
        </Section>
        <Section icon={<CheckCircle2 className="h-4 w-4" />} title="Benefits">
          <Bullets items={scheme.benefits} />
        </Section>
        <Section icon={<FileText className="h-4 w-4" />} title="Required documents">
          <Bullets items={scheme.documents} />
        </Section>
      </div>

      <Section icon={<ClipboardList className="h-4 w-4" />} title="Application process">
        <ol className="space-y-3">
          {scheme.process.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full gradient-primary text-[11px] font-semibold text-white">
                {i + 1}
              </span>
              <span className="min-w-0 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold tracking-tight">Official government website</h2>
        <a
          href={scheme.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block break-all text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          {scheme.url}
        </a>
        <div className="mt-4 grid gap-2 sm:flex">
          <Button variant="outline" className="rounded-full" onClick={() => setOpenEligibility(true)}>
            Check Eligibility
          </Button>
          <Button asChild className="rounded-full gradient-primary text-white">
            <a href={scheme.url} target="_blank" rel="noopener noreferrer">
              Apply Now <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

      <Dialog open={openEligibility} onOpenChange={setOpenEligibility}>
        <DialogContent className="max-h-[80dvh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Check eligibility · {scheme.shortName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              You are eligible if you meet the official criteria below. Final eligibility is confirmed by the
              implementing government facility or portal.
            </p>
            <div className="rounded-xl bg-muted/60 p-3 text-xs">
              <Bullets items={scheme.eligibility} />
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Keep ready</h3>
              <div className="mt-2 rounded-xl bg-muted/60 p-3 text-xs">
                <Bullets items={scheme.documents} />
              </div>
            </div>
            <Button asChild className="w-full rounded-full gradient-primary text-white">
              <a href={scheme.url} target="_blank" rel="noopener noreferrer">
                Continue on official portal <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
