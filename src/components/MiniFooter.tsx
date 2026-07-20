import { Link } from "wouter";
import { Github, Mail, ShieldCheck, Twitter } from "lucide-react";

const columns = [
  {
    title: "Exams",
    links: [
      { label: "SSC CGL",       href: "/exams-covered" },
      { label: "IBPS Banking",  href: "/mock-tests" },
      { label: "Punjab State",  href: "/exams-covered" },
      { label: "Railway RRB",   href: "/pyqs" },
    ],
  },
  {
    title: "Practice",
    links: [
      { label: "My Activity",   href: "/dashboard" },
      { label: "PYQ Repo",      href: "/pyqs" },
      { label: "Mock Tests",    href: "/mock-tests" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy",       href: "/privacy-policy" },
      { label: "Terms",         href: "/terms-and-conditions" },
      { label: "Contact",       href: "/contact" },
    ],
  },
];

export function MiniFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[hsl(222_47%_8%)] text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_3fr] lg:px-8">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-md">E</span>
            <span>
              <span className="block text-sm font-bold tracking-tight text-white">examtree</span>
              <span className="block text-[11px] font-medium text-slate-400">Logic-first test prep</span>
            </span>
          </Link>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
            </span>
            Logic Engine v2.4
          </div>

          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            High-density mocks, PYQs, multilingual review, and deep logic diagnostics for serious exam prep.
          </p>
        </div>

        {/* Links */}
        <div className="grid gap-6 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">{col.title}</h3>
              <div className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <Link
                    key={`${col.title}-${l.href}`}
                    href={l.href}
                    className="block text-sm font-medium text-slate-400 transition hover:text-teal-400"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 ExamTree. Built for exam discovery, practice, and review.</span>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4" />
            <Twitter className="h-4 w-4" />
            <Github className="h-4 w-4" />
            <Mail className="h-4 w-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}
