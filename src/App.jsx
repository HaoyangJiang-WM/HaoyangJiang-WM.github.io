import React, { useMemo, useState } from "react";

export const PROFILE_PHOTO_SRC = "https://raw.githubusercontent.com/HaoyangJiang-WM/Data/main/public/profile.jpg";

export const navItems = [
  { id: "mission", label: "Mission" },
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "publications", label: "Publications" },
  { id: "contact", label: "Contact" },
];

export const researchAreas = [
  ["01", "Physics-guided Graph Learning", "Graph neural networks for transport, flux prediction, and open physical systems where boundaries and hidden forcing shape the dynamics.", "GNN · PDE · Transport"],
  ["02", "Boundary-aware Neural Operators", "Operator learning for boundary value problems on irregular domains, with an emphasis on generalization across geometry and forcing.", "FIE-NO · BVP · Operators"],
  ["03", "Generative Models for Physics", "Flow matching and second-order generative dynamics for scientific data, inverse problems, and simulation-aware sampling.", "Flow Matching · Inversion"],
  ["04", "Geophysical Inverse Modeling", "Reduced forward/inverse modeling for subsurface, hydrology, coastal systems, and measurement-informed physical reconstruction.", "FWI · Assimilation · Sensing"],
];

export const projects = [
  ["01", "Open-boundary Physics GNNs", "Learning hidden boundary forcing in directed and mesh-based physical systems.", ["Ghost-node boundary proxies", "Implicit coupling", "Long-rollout stabilization"]],
  ["02", "FIE Neural Operator", "A Fredholm-integral-equation view of operator learning for irregular boundary value problems.", ["Irregular geometry", "Random Fourier features", "Boundary-conditioned inference"]],
  ["03", "Second-order Flow Matching", "Phase-space acceleration models with variational bridges for images, videos, and PDE snapshots.", ["Acceleration supervision", "OT pairing", "Physics-aware sampling"]],
];

export const publications = [
  ["2025", "Manuscript / Preprint", "Fredholm Integral Equations Neural Operator for Data-Driven Boundary Value Problems", ["Neural Operator", "BVP", "Irregular Domains"]],
  ["2026", "Research in progress", "Physics-guided Graph Neural Networks for Open-boundary Transport Systems", ["Graph Learning", "Open Boundaries", "Hydrology"]],
  ["2026", "Research in progress", "Second-order Optimal-Transport Conditional Flow Matching", ["Flow Matching", "Generative Modeling", "PDE Data"]],
];

export function scrollToId(id) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (el?.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionLabel({ index, title }) {
  return (
    <div className="mb-7 flex items-center gap-4 text-sm uppercase tracking-[0.28em] text-zinc-500">
      <span className="font-mono text-emerald-600">{index}</span>
      <span className="h-px w-14 bg-zinc-300" />
      <span>{title}</span>
    </div>
  );
}

function Arrow() {
  return <span aria-hidden="true" className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>;
}

function ProfilePhotoCard() {
  return (
    <div data-testid="profile-photo-card" className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
      <div className="aspect-[16/11] w-full overflow-hidden bg-zinc-100">
        <img src={PROFILE_PHOTO_SRC} alt="Portrait of Haoyang Jiang" className="h-full w-full object-cover object-center" />
      </div>
      <div className="border-t border-zinc-200 p-5">
        <p className="text-lg font-semibold text-zinc-900">Haoyang Jiang</p>
        <p className="mt-1 text-sm text-zinc-600">Physics-guided AI · Scientific Machine Learning · Graph Learning</p>
      </div>
    </div>
  );
}

function SocialLink({ href, label, primary = false }) {
  return (
    <a href={href} className={`group flex items-center justify-between rounded-2xl px-5 py-4 transition ${primary ? "bg-white text-zinc-950 hover:bg-zinc-100" : "border border-white/15 bg-white/5 text-white hover:bg-white/10"}`}>
      <span>{label}</span>
      <Arrow />
    </a>
  );
}

export default function App() {
  const [active, setActive] = useState("mission");
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <main data-testid="homepage-root" className="min-h-screen overflow-hidden bg-white text-zinc-900 selection:bg-emerald-200 selection:text-zinc-900">
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.02),transparent_22%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(0,0,0,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.35)_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="absolute left-[-15%] top-[18%] h-96 w-96 rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="absolute right-[-12%] top-[8%] h-[30rem] w-[30rem] rounded-full bg-sky-100/60 blur-3xl" />
      </div>

      <header className="fixed left-0 right-0 top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <button onClick={() => scrollToId("top")} className="group flex items-center gap-3" aria-label="Go to top">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-emerald-300 bg-emerald-50 text-sm font-semibold text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">HJ</span>
            <span className="hidden text-sm font-medium tracking-wide text-zinc-800 sm:block">Haoyang Jiang</span>
          </button>
          <nav data-testid="nav" className="hidden items-center gap-1 rounded-full border border-zinc-200 bg-white p-1 lg:flex" aria-label="Main navigation">
            {navItems.map((item, i) => (
              <button key={item.id} onClick={() => { setActive(item.id); scrollToId(item.id); }} className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em] transition ${active === item.id ? "bg-emerald-600 text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"}`}>
                {i + 1}. {item.label}
              </button>
            ))}
          </nav>
          <a href="mailto:haoyangjiang08@gmail.com" className="group inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-800 transition hover:border-emerald-500 hover:bg-emerald-600 hover:text-white">Contact <Arrow /></a>
        </div>
      </header>

      <section id="top" data-testid="hero-section" className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pb-16 pt-28 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="max-w-4xl animate-fadeUp">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">✦ Physics-guided AI · Graph Learning · Scientific Machine Learning</div>
            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-zinc-950 md:text-7xl lg:text-[6.4rem]">Building AI for open physical systems.</h1>
            <div className="mt-10 grid gap-8 border-t border-zinc-200 pt-8 md:grid-cols-[1.1fr_0.9fr]">
              <p className="max-w-3xl text-xl leading-8 text-zinc-700 md:text-2xl md:leading-9">I am a Data Science PhD researcher at William &amp; Mary working on physics-guided machine learning for transport, boundaries, inverse problems, and reduced-order scientific modeling.</p>
              <div className="grid gap-3 text-sm text-zinc-600 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"><p className="mb-4 text-emerald-600">⌖</p><p className="text-zinc-900">Williamsburg, Virginia</p><p>William &amp; Mary</p></div>
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"><p className="mb-4 text-emerald-600">◉</p><p className="text-zinc-900">Research focus</p><p>Physics AI for real engineering systems</p></div>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <button onClick={() => scrollToId("research")} className="group inline-flex items-center gap-3 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">Explore research <span>›</span></button>
              <a href="#" className="inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50">Download CV</a>
            </div>
          </div>
          <div className="mx-auto w-full max-w-xl lg:max-w-none"><ProfilePhotoCard /></div>
        </div>
        <div className="pointer-events-none absolute bottom-8 left-5 right-5 hidden justify-between text-xs uppercase tracking-[0.25em] text-zinc-400 md:flex md:px-8"><span>Physics-aware learning</span><span>Open boundaries</span><span>Inverse modeling</span></div>
      </section>

      <section id="mission" className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8">
        <SectionLabel index="01" title="Mission" />
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-zinc-950 md:text-6xl">Learning systems that respect physics, uncertainty, and boundaries.</h2>
          <p className="text-lg leading-8 text-zinc-700">Many scientific ML models work best in closed, clean settings. Real physical systems are open: they exchange mass, energy, information, and uncertainty through boundaries. My work develops machine learning models that treat those boundaries as first-class objects instead of noise.</p>
        </div>
      </section>

      <section id="research" className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8">
        <SectionLabel index="02" title="Research" />
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"><h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-zinc-950 md:text-6xl">Research at the intersection of AI, PDEs, and engineering systems.</h2><p className="max-w-md text-zinc-600">The common thread: make neural models useful when data are sparse, domains are irregular, and physics is only partially observed.</p></div>
        <div className="grid gap-4 md:grid-cols-2">
          {researchAreas.map(([num, title, text, tag]) => <article key={title} className="group relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm transition hover:border-emerald-300 hover:shadow-md"><div className="mb-10 flex items-center justify-between"><div className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-200 bg-emerald-50 font-mono text-emerald-700">{num}</div><span className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500">{tag}</span></div><h3 className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-zinc-950">{title}</h3><p className="leading-7 text-zinc-600">{text}</p></article>)}
        </div>
      </section>

      <section id="projects" className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8">
        <SectionLabel index="03" title="Projects" />
        <div className="divide-y divide-zinc-200 rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
          {projects.map(([num, title, subtitle, details]) => <article key={title} className="grid gap-6 p-6 transition hover:bg-zinc-50 md:grid-cols-[0.18fr_0.82fr] md:p-8"><div className="font-mono text-4xl text-emerald-600/90 md:text-5xl">{num}</div><div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-start"><div><h3 className="text-3xl font-semibold tracking-[-0.04em] text-zinc-950 md:text-4xl">{title}</h3><p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">{subtitle}</p></div><div className="flex flex-wrap gap-2">{details.map((item) => <span key={item} className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-700">{item}</span>)}</div></div></article>)}
        </div>
      </section>

      <section id="publications" className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8">
        <SectionLabel index="04" title="Publications" />
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"><h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-zinc-950 md:text-6xl">Selected writing and research outputs.</h2><a href="#" className="group inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm text-zinc-800 transition hover:bg-zinc-50">View all <Arrow /></a></div>
        <div className="grid gap-4">
          {publications.map(([year, venue, title, tags]) => <article key={title} className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"><div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-zinc-500"><span>{year}</span><span className="h-1 w-1 rounded-full bg-zinc-400" /><span>{venue}</span></div><h3 className="max-w-4xl text-2xl font-semibold tracking-[-0.03em] text-zinc-950">{title}</h3><div className="mt-5 flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">{tag}</span>)}</div></article>)}
        </div>
      </section>

      <section id="contact" className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-zinc-950 p-8 text-white md:p-12"><div className="grid gap-10 md:grid-cols-[1fr_0.6fr] md:items-end"><div><p className="mb-5 text-sm uppercase tracking-[0.25em] text-zinc-400">Contact</p><h2 className="max-w-3xl text-5xl font-semibold leading-none tracking-[-0.06em] md:text-7xl">Let’s build AI for physical systems.</h2></div><div className="space-y-3"><SocialLink href="mailto:haoyangjiang08@gmail.com" label="Email" primary /><SocialLink href="https://github.com/HaoyangJiang-WM" label="GitHub" /><SocialLink href="#" label="LinkedIn" /><SocialLink href="#" label="Google Scholar" /></div></div></div>
      </section>

      <footer className="relative z-10 border-t border-zinc-200 px-5 py-8 text-sm text-zinc-500 md:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row"><p>© {year} Haoyang Jiang. Physics-guided AI for open systems.</p><p>Designed as a light, research-focused personal homepage.</p></div></footer>
    </main>
  );
}
