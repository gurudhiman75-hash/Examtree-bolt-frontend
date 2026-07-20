import { Link, useLocation } from "wouter";
import {
  ClipboardList,
  Home,
  LogOut,
  Settings,
  ShieldCheck,
  Target,
  User,
  WandSparkles,
} from "lucide-react";
import { signOut } from "firebase/auth";

import { getFirebaseAuth } from "@/lib/firebase";
import { clearAuth, getUser } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const primaryLinks = [
  { href: "/",          label: "Home",          icon: Home         },
  { href: "/tests",     label: "Tests & Exams",  icon: ClipboardList },
  { href: "/dashboard", label: "My Activity",    icon: Target       },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const user  = getUser();
  const { toast } = useToast();
  const isAdmin = user?.role === "admin";

  const links = isAdmin
    ? [
        ...primaryLinks,
        { href: "/admin",                                    label: "Admin",           icon: ShieldCheck   },
        { href: "/admin/content/questions/generate",         label: "Question Studio", icon: WandSparkles  },
      ]
    : primaryLinks;

  const handleLogout = async () => {
    const auth = getFirebaseAuth();
    try   { if (auth) await signOut(auth); }
    catch { /* resilient */ }
    finally {
      clearAuth();
      toast({ title: "Logged out", description: "Your session has ended." });
      setLocation("/");
    }
  };

  return (
    <Sidebar
      className={[
        "border-r border-[hsl(220_25%_17%)]",
        "bg-[hsl(222_47%_8%)] text-slate-200",
        "[&_[data-sidebar=sidebar]]:border-[hsl(220_25%_17%)]",
        "[&_[data-sidebar=sidebar]]:bg-[hsl(222_47%_8%)]",
        "[&_[data-slot=sidebar-inner]]:bg-[hsl(222_47%_8%)]",
      ].join(" ")}
      collapsible="icon"
    >
      {/* ── Logo ── */}
      <SidebarHeader className="border-b border-[hsl(220_25%_17%)] px-4 py-4">
        <Link href="/" className="flex items-center gap-3 rounded-lg px-1 py-1 transition hover:bg-white/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-[0_0_0_1px_rgba(96,165,250,.3)]">
            <span className="text-sm font-bold tracking-tight">E</span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight text-white">examtree</p>
            <p className="truncate text-[11px] font-medium text-slate-400">Tree of success</p>
          </div>
        </Link>
      </SidebarHeader>

      {/* ── Nav links ── */}
      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="space-y-0.5">
          {links.map((link) => {
            const active =
              location === link.href
              || (link.href === "/tests"     && (location.startsWith("/category") || location.startsWith("/subcategory")))
              || (link.href === "/dashboard" && location.startsWith("/test/"));

            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={link.label}
                  className={[
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    "text-slate-300 hover:bg-white/8 hover:text-white",
                    "data-[active=true]:bg-blue-600/15 data-[active=true]:text-blue-300",
                    "data-[active=true]:border-l-2 data-[active=true]:border-blue-500 data-[active=true]:pl-[10px]",
                  ].join(" ")}
                >
                  <Link href={link.href} className="flex items-center gap-3">
                    <link.icon className="h-4 w-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* ── User footer ── */}
      <SidebarFooter className="border-t border-[hsl(220_25%_17%)] p-3">
        {user ? (
          <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 p-2.5 backdrop-blur-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-300 ring-1 ring-blue-500/25">
              {isAdmin ? <ShieldCheck className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{user.name}</p>
              <p className="truncate text-[11px] text-slate-400">{isAdmin ? "Administrator" : "Student"}</p>
            </div>
            <Link
              href="/profile"
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/8 hover:text-white"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-500/15 hover:text-rose-300"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <SidebarMenuButton
            asChild
            className="rounded-xl border border-blue-500/30 bg-blue-600/10 text-blue-300 hover:bg-blue-600/20 hover:text-blue-200 font-semibold"
          >
            <Link href="/login/student">Sign in</Link>
          </SidebarMenuButton>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
