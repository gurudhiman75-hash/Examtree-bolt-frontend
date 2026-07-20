import { Link } from "wouter";
import { Mail, MessageSquareWarning, ShieldCheck } from "lucide-react";

const groups = [
  {
    title: "Platform",
    links: [
      { label: "About Us",      href: "/about" },
      { label: "Contact Us",    href: "/contact" },
      { label: "FAQ",           href: "/faq" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Mock Tests",    href: "/mock-tests" },
      { label: "PYQs",          href: "/pyqs" },
      { label: "Exams Covered", href: "/exams-covered" },
      { label: "Blog",          href: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy",      href: "/privacy-policy" },
      { label: "Terms & Conditions",  href: "/terms-and-conditions" },
      { label: "Refund Policy",       href: "/refund-policy" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Report Question",  href: "/report-question" },
      { label: "Help & Support",   href: "/contact" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[hsl(222_47%_8%)] text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_2fr] lg:px-8">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg">E</div>
            <div>
              <p className="text-base font-bold tracking-tight text-white">examtree</p>
              <p className="text-xs font-medium text-slate-400">Tree of success</p>
            </div>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            ExamTree helps aspirants discover mock tests, PYQs, multilingual practice, and deep performance analysis for serious exam preparation.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified workflow
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
              <Mail className="h-3.5 w-3.5" />
              support@examtree.in
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <MessageSquareWarning className="h-3.5 w-3.5" />
              Question QA
            </span>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">{group.title}</h3>
              <div className="mt-3 space-y-2">
                {group.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block text-sm font-medium text-slate-400 transition hover:text-white"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 px-4 py-4 text-center text-xs text-slate-500">
        © 2026 ExamTree. All rights reserved. Exam names are used for preparation and discovery purposes.
      </div>
    </footer>
  );
}
