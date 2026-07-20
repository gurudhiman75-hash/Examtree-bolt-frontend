import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, ChartBar as BarChart3, BookOpenCheck, BrainCircuit, CircleCheck as CheckCircle2, ChevronRight, Clock3, ClipboardList, Flame, Lock, Search, Sparkles, Star, TrendingUp, Users, Zap } from "lucide-react";
import { getActiveTestSessions, getAttempts } from "@/lib/storage";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category, Subcategory, Test } from "@/lib/data";
import { buildExamTreeNodes } from "@/lib/exam-tree";

// ── Types ──────────────────────────────────────────────────────────────────────

type ExamNode = {
  id: string;
  name: string;
  description: string;
  icon: string;
  tests: Test[];
  subcategories: { id: string; name: string }[];
};

function buildNodes(
  categories: Category[],
  subcategories: Subcategory[],
  tests: Test[],
): ExamNode[] {
  return buildExamTreeNodes(categories, subcategories, tests).map((n) => ({
    id: n.id,
    name: n.name,
    description: n.description,
    icon: n.icon,
    tests: n.tests,
    subcategories: n.subcategories.map((s) => ({ id: s.id, name: s.name })).slice(0, 5),
  }));
}

function compact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k+`;
  return String(n);
}

// ── Subcomponents ──────────────────────────────────────────────────────────────

function StatPill({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
      <Icon className="h-4 w-4 shrink-0 text-blue-600" />
      <div>
        <p className="text-base font-bold tabular-nums text-slate-900">{value}</p>
        <p className="text-[11px] font-medium text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function CategoryCard({ node, onNavigate }: { node: ExamNode; onNavigate: (path: string) => void }) {
  const totalAttempts = node.tests.reduce((s, t) => s + (t.attempts ?? 0), 0);
  const pyqs          = node.tests.filter((t) => t.name.toLowerCase().includes("pyq")).length;

  return (
    <article
      onClick={() => onNavigate(`/category/${node.id}`)}
      className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_12px_40px_rgba(26,86,219,0.12)]"
    >
      {/* Icon + badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(222_47%_10%)] text-white shadow-md">
          <CategoryIcon icon={node.icon} className="h-5 w-5" />
        </div>
        <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700">
          {compact(Math.max(1200, totalAttempts))} enrolled
        </span>
      </div>

      {/* Title + description */}
      <h3 className="mt-4 text-lg font-bold text-slate-900">{node.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">{node.description}</p>

      {/* Stats strip */}
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-center text-xs">
        <div>
          <p className="font-bold text-slate-900">{node.tests.length}</p>
          <p className="text-slate-400">Tests</p>
        </div>
        <div>
          <p className="font-bold text-slate-900">{node.subcategories.length}</p>
          <p className="text-slate-400">Exams</p>
        </div>
        <div>
          <p className="font-bold text-teal-600">{pyqs}</p>
          <p className="text-slate-400">PYQs</p>
        </div>
      </div>

      {/* Sub-exams */}
      {node.subcategories.length > 0 && (
        <div className="mt-3 space-y-1">
          {node.subcategories.slice(0, 3).map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={(e) => { e.stopPropagation(); onNavigate(`/subcategory/${sub.id}`); }}
              className="flex w-full items-center justify-between rounded-lg border border-transparent px-2.5 py-1.5 text-left text-xs font-medium text-slate-600 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            >
              <span className="truncate">{sub.name}</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-4 flex items-center justify-between text-sm font-semibold text-blue-600">
        <span>Open category</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </article>
  );
}

function FeatureHighlight({ icon: Icon, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{body}</p>
      </div>
    </div>
  );
}

const TESTIMONIALS = [
  { name: "Amandeep K.", exam: "Punjab State Exams", text: "Logic playback made seating puzzles feel transparent instead of random." },
  { name: "Ritika S.",   exam: "SSC CGL",            text: "Mock analysis is sharper than a scorecard. I know exactly what to fix." },
  { name: "Harsh M.",   exam: "Banking",             text: "Speed and accuracy diagnosis stopped me over-solving easy questions." },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function Home() {
  const [, setLocation]     = useLocation();
  const attempts            = getAttempts();
  const activeSessions      = getActiveTestSessions();
  const { tests, categories, subcategories, isLoading } = useExamCatalog();
  const [query, setQuery]   = useState("");

  const nodes = useMemo(() => buildNodes(categories, subcategories, tests), [categories, subcategories, tests]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return nodes;
    return nodes.filter((n) =>
      n.name.toLowerCase().includes(q) ||
      n.tests.some((t) => t.name.toLowerCase().includes(q))
    );
  }, [nodes, query]);

  const totalTests     = tests.length;
  const totalAttempts  = tests.reduce((s, t) => s + (t.attempts ?? 0), 0);
  const latestAttempt  = attempts[0] ?? null;
  const resumeSessions = Object.values(activeSessions).slice(0, 2);
  const hasActivity    = latestAttempt || resumeSessions.length > 0;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="skeleton-shimmer h-64 rounded-2xl" />
        <div className="grid gap-5 md:grid-cols-3">
          <div className="skeleton-shimmer h-56 rounded-2xl" />
          <div className="skeleton-shimmer h-56 rounded-2xl" />
          <div className="skeleton-shimmer h-56 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/6 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-teal-500/6 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,86,219,0.04),transparent_52%)]" />
        </div>

        <div className="relative grid min-h-[320px] gap-8 p-7 lg:grid-cols-[1fr_auto] lg:p-10">
          {/* Left: copy */}
          <div className="flex flex-col justify-between gap-6">
            <div>
              {/* Label */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                Logic-first exam engine
              </div>

              {/* Headline */}
              <h1 className="mt-5 max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
                India's sharpest{" "}
                <span className="text-gradient-blue">mock-test</span>{" "}
                platform.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">
                SSC CGL, Banking (IBPS/SBI), and Punjab State Exams — with structured mocks, quant patterns, PYQs, multilingual review, and deep logic analysis.
              </p>

              {/* Search */}
              <div className="relative mt-7 max-w-lg">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search SSC, IBPS, Punjab Police, Quant…"
                  className="h-12 rounded-xl border-slate-200 pl-11 shadow-sm focus-visible:ring-blue-500/40"
                />
              </div>

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() => setLocation("/tests")}
                  className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700"
                >
                  Explore tests <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/dashboard")}
                  className="h-11 rounded-xl border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  My activity
                </Button>
              </div>
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-2">
              <StatPill label="Live tests"     value={compact(Math.max(50, totalTests))}                      icon={ClipboardList} />
              <StatPill label="Aspirants"      value={compact(Math.max(12_000, totalAttempts))}               icon={Users} />
              <StatPill label="Avg accuracy"   value="74%"                                                    icon={TrendingUp} />
              <StatPill label="PYQs available" value={compact(nodes.reduce((s,n)=>s+n.tests.filter(t=>t.name.toLowerCase().includes("pyq")).length,0)||50)} icon={BookOpenCheck} />
            </div>
          </div>

          {/* Right: feature highlights */}
          <div className="hidden w-72 flex-col gap-5 rounded-2xl border border-slate-100 bg-slate-50 p-5 lg:flex">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Why ExamTree</p>
            <FeatureHighlight icon={BrainCircuit} title="Logic Playback"   body="Watch seating and puzzle solutions reconstruct step by step." />
            <FeatureHighlight icon={BarChart3}    title="Deep diagnostics" body="Section-wise accuracy, time splits, and weak-area detection." />
            <FeatureHighlight icon={Zap}          title="Multilingual"     body="English, Hindi, and Punjabi (Gurmukhi) side-by-side." />
            <FeatureHighlight icon={Flame}        title="PYQ first"        body="Previous year questions prioritised in every exam path." />
          </div>
        </div>
      </section>

      {/* ── Resume / activity strip ───────────────────────────────────────────── */}
      {hasActivity && (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {latestAttempt && (
            <button
              type="button"
              onClick={() => setLocation(`/result?testId=${latestAttempt.testId}&tab=review`)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{latestAttempt.testName}</p>
                <p className="text-xs text-slate-400">Last score: {latestAttempt.score}%</p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-300" />
            </button>
          )}
          {resumeSessions.map((s) => (
            <button
              key={s.testId}
              type="button"
              onClick={() => setLocation(`/test/${s.testId}`)}
              className="flex items-center gap-3 rounded-2xl border border-teal-200 bg-teal-50/60 px-4 py-3.5 text-left shadow-sm transition hover:border-teal-300 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <Clock3 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{s.testName}</p>
                <p className="text-xs text-teal-600">In progress — resume</p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-300" />
            </button>
          ))}
        </section>
      )}

      {/* ── Exam category grid ────────────────────────────────────────────────── */}
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Exam pathways</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Find the right mock series</h2>
          </div>
          <button
            type="button"
            onClick={() => setLocation("/tests")}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
          >
            All categories <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-14 text-center">
            <p className="text-sm text-slate-400">No categories match "{query}"</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((node) => (
              <CategoryCard key={node.id} node={node} onNavigate={setLocation} />
            ))}
          </div>
        )}
      </section>

      {/* ── Featured tests ticker ─────────────────────────────────────────────── */}
      {tests.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Live tests</p>
                <h2 className="mt-0.5 text-xl font-bold text-slate-900">Jump in now</h2>
              </div>
              <button
                type="button"
                onClick={() => setLocation("/tests")}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {tests.slice(0, 6).map((test) => {
              const isPaid = (test.access ?? "free") !== "free";
              return (
                <button
                  key={test.id}
                  type="button"
                  onClick={() => setLocation(`/test/${test.id}`)}
                  className="grid w-full gap-3 px-6 py-3.5 text-left transition hover:bg-slate-50 md:grid-cols-[1fr_100px_100px_120px]"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{test.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{test.category} · {test.subcategoryName ?? "General"}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                    <ClipboardList className="h-3.5 w-3.5 text-slate-400" />
                    {test.totalQuestions} Q
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                    <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                    {test.duration} min
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${isPaid ? "border border-amber-200 bg-amber-50 text-amber-700" : "border border-teal-200 bg-teal-50 text-teal-700"}`}>
                    {isPaid ? <Lock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                    {isPaid ? "Premium" : "Free"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Social proof ──────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Aspirant feedback</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">What students say</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex gap-0.5 text-amber-400">
                {[1,2,3,4,5].map((s) => <Star key={s} className="h-3.5 w-3.5 fill-current" />)}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">"{t.text}"</p>
              <div className="mt-4 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/10 text-[11px] font-bold text-blue-700">
                  {t.name.slice(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">{t.name}</p>
                  <p className="text-[11px] text-slate-400">{t.exam}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
