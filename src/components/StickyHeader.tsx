import { useEffect, useMemo, useState } from "react";
import { BarChart3, ChevronDown, CircleUserRound, Compass, Search, X } from "lucide-react";
import { useLocation } from "wouter";

import { CategoryIcon } from "@/components/CategoryIcon";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { buildExamTreeNodes } from "@/lib/exam-tree";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

function routeId(location: string, prefix: string) {
  return location.startsWith(prefix)
    ? decodeURIComponent(location.slice(prefix.length).split("/")[0] ?? "")
    : "";
}

export function StickyHeader() {
  const [location, setLocation] = useLocation();
  const { categories, subcategories, tests } = useExamCatalog();
  const [open, setOpen]       = useState(false);
  const [compact, setCompact] = useState(false);
  const [query, setQuery]     = useState("");

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setQuery(""); }, [location]);

  const nodes = useMemo(
    () => buildExamTreeNodes(categories, subcategories, tests),
    [categories, subcategories, tests],
  );

  const filteredNodes = useMemo(() => {
    if (!query.trim()) return nodes;
    const q = query.toLowerCase();
    return nodes
      .map((cat) => ({
        ...cat,
        subcategories: cat.subcategories.filter((s) => s.name.toLowerCase().includes(q)),
        tests: cat.tests.filter((t) => t.name.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.name.toLowerCase().includes(q) || cat.subcategories.length || cat.tests.length);
  }, [nodes, query]);

  const selected = useMemo(() => {
    const categoryId    = routeId(location, "/category/");
    const subcategoryId = routeId(location, "/subcategory/");
    const testId        = routeId(location, "/test/");

    if (testId) {
      for (const cat of nodes) {
        for (const sub of cat.subcategories) {
          const test = sub.tests.find((t) => t.id === testId);
          if (test) return { cat, sub, test };
        }
      }
    }
    if (subcategoryId) {
      for (const cat of nodes) {
        const sub = cat.subcategories.find((s) => s.id === subcategoryId);
        if (sub) return { cat, sub, test: null };
      }
    }
    if (categoryId) {
      const cat = nodes.find((c) => c.id === categoryId);
      if (cat) return { cat, sub: null, test: null };
    }
    return null;
  }, [location, nodes]);

  const label = selected
    ? [selected.cat.name, selected.sub?.name, selected.test?.name].filter(Boolean).join(" › ")
    : "Select exam…";

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50",
        "border-b border-slate-200/60",
        "bg-white/85 backdrop-blur-xl",
        "transition-[padding] duration-300 ease-in-out",
        "md:left-[var(--sidebar-width)]",
        compact ? "py-1.5" : "py-3",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 px-4 sm:px-5">
        {/* Sidebar toggle */}
        <SidebarTrigger className="shrink-0 rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition" />

        {/* Brand badge (desktop) */}
        <div className="hidden items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:flex">
          <Compass className="h-3.5 w-3.5 text-teal-500" />
          ExamTree
        </div>

        {/* Exam selector pill */}
        <div className="relative mx-auto w-full max-w-2xl">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={[
              "flex h-10 w-full items-center justify-between gap-2 rounded-full",
              "border bg-white/90 px-4 text-left text-sm font-medium shadow-sm",
              "transition-all duration-200",
              open
                ? "border-blue-400 ring-2 ring-blue-500/20 text-slate-900"
                : "border-slate-200 text-slate-600 hover:border-blue-300 hover:text-slate-900",
            ].join(" ")}
          >
            <span className="flex min-w-0 items-center gap-2">
              <Search className="h-3.5 w-3.5 shrink-0 text-teal-500" />
              <span className="truncate">{label}</span>
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute left-1/2 top-full mt-2 w-[min(900px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_-10px_rgba(15,23,42,0.18)]">
              {/* Search bar inside dropdown */}
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search categories, exams, tests…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                {query && (
                  <button type="button" onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setLocation("/tests")}
                  className="ml-2 shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                >
                  Full explorer
                </button>
              </div>

              {/* Category grid */}
              <div className="max-h-[60vh] overflow-y-auto p-3">
                {filteredNodes.length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-400">No results for "{query}"</p>
                ) : (
                  <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                    {filteredNodes.map((cat) => (
                      <div key={cat.id} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                        {/* Category row */}
                        <button
                          type="button"
                          onClick={() => setLocation(`/category/${cat.id}`)}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition hover:bg-white hover:shadow-sm"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(222_47%_10%)] text-white shadow-sm">
                            <CategoryIcon icon={cat.icon} className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-slate-900">{cat.name}</span>
                            <span className="text-[11px] text-slate-400">{cat.tests.length} tests</span>
                          </span>
                        </button>

                        {/* Subcategory rows */}
                        {cat.subcategories.slice(0, 4).map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => setLocation(`/subcategory/${sub.id}`)}
                            className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition hover:bg-white"
                          >
                            <span className="truncate text-xs font-medium text-slate-600">{sub.name}</span>
                            <span className="ml-2 shrink-0 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">{sub.tests.length}</span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setLocation("/dashboard")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            aria-label="My activity"
            title="My activity"
          >
            <BarChart3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setLocation("/profile")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            aria-label="User profile"
            title="User profile"
          >
            <CircleUserRound className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
