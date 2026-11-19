import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { optionContent } from "@/features/services/options";
import { ServicePage } from "@/features/services/ServicePage";
import { getItem } from "@/lib/content";
import { photoOptions } from "@/lib/site";

/* Photo editing's options, HDR and Flambient (owner, 2026-11-19): the service template with the option's hero, fixes
   and questions (features/services/options.ts); price, turnaround, levels and work stay Photo editing's (admin). */

type Props = { params: Promise<{ slug: string; option: string }> };

export function generateStaticParams() {
  return photoOptions.map((o) => ({ slug: "photo-editing", option: o.slug }));
}

async function load(params: Props["params"]) {
  const { slug, option } = await params;
  const o = photoOptions.find((x) => x.slug === option);
  const s = slug === "photo-editing" && o ? await getItem("services", slug) : undefined;
  return s && o ? { s: { ...s, ...optionContent[o.slug]! }, o } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await load(params);
  if (!found) return {};
  const { s, o } = found;
  return {
    title: `${o.label}: ${s.from.toLowerCase()}`,
    description: `${s.hero.lede} ${s.from}, back in ${s.turnaround}, revisions free. Try 10 photos free.`,
    alternates: { canonical: `/services/${s.slug}/${o.slug}` },
  };
}

export default function OptionPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="wrap min-h-[160svh] pt-36" aria-busy="true" />}>
      <OptionBody params={params} />
    </Suspense>
  );
}

async function OptionBody({ params }: Props) {
  const found = await load(params);
  if (!found) notFound();
  return <ServicePage service={found.s} option={{ slug: found.o.slug, label: found.o.label }} />;
}
