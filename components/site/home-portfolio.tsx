"use client";



import Link from "next/link";

import Image from "next/image";



import { FadeIn } from "@/components/site/fade-in";



export type HomePortfolioProject = {

  id: string;

  title: string;

  description?: string | null;

  href: string;

  imageUrl?: string | null;

};



type Props = {

  eyebrow: string;

  title: string;

  ctaLabel: string;

  ctaHref: string;

  projects: HomePortfolioProject[];

};



function ProjectCard({ project, index }: { project: HomePortfolioProject; index: number }) {

  const imageUrl = project.imageUrl?.trim() ?? "";

  const isLocal = imageUrl.startsWith("/");



  return (

    <FadeIn delay={((index % 3) * 100) as 0 | 100 | 200}>

      <Link

        href={project.href}

        className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 sm:aspect-[3/4]"

      >

        {imageUrl ? (

          isLocal ? (

            <Image

              src={imageUrl}

              alt=""

              fill

              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"

              className="object-cover transition duration-700 ease-out group-hover:scale-105"

            />

          ) : (

            // eslint-disable-next-line @next/next/no-img-element

            <img

              src={imageUrl}

              alt=""

              className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"

            />

          )

        ) : (

          <div

            className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-900 transition duration-700 group-hover:scale-105"

            aria-hidden

          />

        )}



        <div

          aria-hidden

          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/92"

        />

        <div

          aria-hidden

          className="absolute inset-x-0 bottom-0 h-[2px] scale-x-0 bg-site-brand transition-transform duration-500 group-hover:scale-x-100"

        />



        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">

          <h3

            style={{ fontFamily: "var(--font-display), Georgia, serif" }}

            className="text-[clamp(1.25rem,2.2vw,1.65rem)] font-light leading-snug tracking-tight text-white"

          >

            {project.title}

          </h3>

          {project.description?.trim() ? (

            <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-white/70">

              {project.description}

            </p>

          ) : null}

        </div>

      </Link>

    </FadeIn>

  );

}



export function HomePortfolio({ eyebrow, title, ctaLabel, ctaHref, projects }: Props) {

  return (

    <section

      id="portfolio"

      className="scroll-mt-header relative z-10 overflow-x-hidden bg-zinc-950 py-section-y text-white"

    >

      <div

        aria-hidden

        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgb(var(--site-brand-rgb)/0.14),transparent_55%)]"

      />



      <div className="relative mx-auto max-w-7xl px-6 lg:px-16">

        <FadeIn className="mb-10 flex flex-col items-start gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">

          <div className="max-w-2xl">

            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.34em] text-[#ffd0b8] sm:text-[11px]">

              {eyebrow}

            </p>

            <h2

              style={{ fontFamily: "var(--font-display), Georgia, serif" }}

              className="text-[clamp(1.85rem,3.5vw,3rem)] font-light leading-[1.12] tracking-tight text-[#fff8f2]"

            >

              {title}

            </h2>

          </div>

          {ctaLabel.trim() ? (

            <Link

              href={ctaHref}

              className="inline-flex min-h-[44px] shrink-0 items-center py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-site-brand-accent active:text-site-brand-accent sm:text-[11px]"

            >

              {ctaLabel} →

            </Link>

          ) : null}

        </FadeIn>



        {projects.length > 0 ? (

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">

            {projects.map((project, i) => (

              <ProjectCard key={project.id} project={project} index={i} />

            ))}

          </div>

        ) : (

          <FadeIn>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-8 py-16 text-center">

              <p

                style={{ fontFamily: "var(--font-display), Georgia, serif" }}

                className="text-lg font-light text-white/90"

              >

                Projekti uskoro.

              </p>

            </div>

          </FadeIn>

        )}

      </div>

    </section>

  );

}


