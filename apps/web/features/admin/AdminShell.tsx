"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import {
  ChevronsUpDown, ExternalLink, FileText, History, Images, Info, Layers, LayoutDashboard, LogOut, MessageCircleQuestion,
  Inbox, PanelLeft, PenLine, Quote, Search, Tag, Tags, Upload, Users, HeartHandshake, X, type LucideIcon,
} from "lucide-react";
import { SECTIONS } from "@/lib/content/fields";
import { Mark } from "@techx/ui/Icons";
import { logout } from "@/app/admin/actions";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { cn } from "./ui/utils";

/* The admin panel's shell in the shadcn/ui dashboard style (owner, 2026-11-03: "use the shadcn dashboard on the
   backend, not the frontend"). Sidebar (inset variant) with grouped sections and icons, collapsible to icons on
   desktop (remembered in a cookie) and a slide-in sheet on phones; the page sits in a rounded inset panel with a top
   bar and breadcrumbs. */

const ICONS: Record<string, LucideIcon> = {
  services: Layers, pricing: Tag, work: Images, categories: Tags, testimonials: Quote, faqs: MessageCircleQuestion, blog: PenLine,
  timeline: History, values: HeartHandshake, team: Users, facts: Info, seo: Search, uploads: Upload, contacts: Inbox,
};
const GROUPS: { label: string; keys: string[] }[] = [
  { label: "Inbox", keys: ["contacts"] },
  { label: "Offer", keys: ["services", "pricing"] },
  { label: "Proof and writing", keys: ["work", "categories", "testimonials", "faqs", "blog"] },
  { label: "About page", keys: ["timeline", "values", "team"] },
  { label: "Site-wide", keys: ["facts", "seo", "uploads"] },
];
const titleOf = (key: string) => (key === "uploads" ? "Free-trial uploads" : key === "contacts" ? "Contact list" : SECTIONS.find((s) => s.key === key)?.title ?? key);

export function AdminShell({ defaultOpen, email, children }: { defaultOpen: boolean; email: string; children: ReactNode }) {
  const [open, setOpenState] = useState(defaultOpen);
  const [mobile, setMobile] = useState(false);
  const setOpen = (v: boolean) => { setOpenState(v); document.cookie = `admin_sidebar=${v ? "1" : "0"}; path=/admin; max-age=31536000; samesite=lax`; };
  const path = usePathname();
  const key = path.split("/")[2];

  return (
    <div className="flex min-h-svh w-full bg-sidebar" data-sidebar-state={open ? "expanded" : "collapsed"}>
      {/* desktop sidebar: a spacer that holds the width, and the fixed panel */}
      <div aria-hidden="true" className={cn("hidden shrink-0 transition-[width] duration-200 ease-linear md:block", open ? "w-64" : "w-[calc(3rem+1rem)]")} />
      <aside className={cn("fixed inset-y-0 left-0 z-10 hidden h-svh flex-col p-2 transition-[width] duration-200 ease-linear md:flex", open ? "w-64" : "w-[calc(3rem+1rem)]")}>
        <SidebarBody collapsed={!open} path={path} email={email} onNavigate={() => {}} />
      </aside>

      {/* phones: the same sidebar as a sheet */}
      <Dialog.Root open={mobile} onOpenChange={setMobile}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 md:hidden" />
          <Dialog.Content data-admin className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-sidebar p-2 shadow-lg md:hidden">
            <Dialog.Title className="sr-only">Admin menu</Dialog.Title>
            <Dialog.Description className="sr-only">Sections of the website you can edit</Dialog.Description>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon-sm" className="absolute top-3 right-3" aria-label="Close menu"><X /></Button>
            </Dialog.Close>
            <SidebarBody collapsed={false} path={path} email={email} onNavigate={() => setMobile(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* inset panel */}
      <main className="relative flex min-w-0 flex-1 flex-col bg-background md:m-2 md:ml-0 md:rounded-xl md:shadow-sm md:ring-1 md:ring-sidebar-border">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur md:rounded-t-xl lg:px-6">
          <Button variant="ghost" size="icon-sm" className="-ml-1.5 hidden md:inline-flex" aria-label={open ? "Collapse sidebar" : "Expand sidebar"} onClick={() => setOpen(!open)}><PanelLeft /></Button>
          <Button variant="ghost" size="icon-sm" className="-ml-1.5 md:hidden" aria-label="Open menu" onClick={() => setMobile(true)}><PanelLeft /></Button>
          <Separator orientation="vertical" className="mx-1 h-4!" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="max-sm:hidden"><Link href="/admin" className="transition-colors hover:text-foreground">Admin</Link></BreadcrumbItem>
              {key && <BreadcrumbSeparator className="max-sm:hidden" />}
              <BreadcrumbItem><BreadcrumbPage>{key ? titleOf(key) : "Overview"}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button variant="outline" size="sm" asChild className="ml-auto">
            <a href={key === "blog" ? "/blog" : "/"} target="_blank" rel="noopener"><ExternalLink /> <span className="max-sm:hidden">View website</span><span className="sm:hidden">Site</span></a>
          </Button>
        </header>
        <div className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}

function SidebarBody({ collapsed, path, email, onNavigate }: { collapsed: boolean; path: string; email: string; onNavigate: () => void }) {
  const item = (href: string, label: string, Icon: LucideIcon) => {
    const on = path === href;
    return (
      <li key={href}>
        <Link href={href} onClick={onNavigate} aria-current={on ? "page" : undefined} title={collapsed ? label : undefined} data-slot="sidebar-menu-button"
          className={cn(
            "flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm text-sidebar-foreground/80 outline-none transition-[width,height,padding,background-color,color] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring [&>svg]:size-4 [&>svg]:shrink-0",
            on && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
            collapsed && "size-8! p-2!",
          )}>
          <Icon />
          <span className={cn("truncate", collapsed && "sr-only")}>{label}</span>
        </Link>
      </li>
    );
  };
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* header: the workspace */}
      <div className="flex flex-col gap-2 p-2">
        <Link href="/admin" onClick={onNavigate} data-slot="sidebar-menu-button" className={cn("flex items-center gap-2 overflow-hidden rounded-md p-1 outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring", collapsed && "size-8 p-0")}>
          <span className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-[0_0_0_1px_rgb(10_10_11/0.06)]"><Mark /></span>
          <span className={cn("grid flex-1 text-left text-sm leading-tight", collapsed && "sr-only")}>
            <span className="truncate font-semibold">TechX Systems</span>
            <span className="truncate text-xs text-muted-foreground">Website admin</span>
          </span>
        </Link>
      </div>

      {/* content */}
      <nav aria-label="Admin" className="flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto">
        <div className="p-2">
          <ul className="grid gap-1">{item("/admin", "Overview", LayoutDashboard)}</ul>
        </div>
        {GROUPS.map((g) => (
          <div key={g.label} className="relative flex flex-col p-2 pt-0">
            <p className={cn("flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 transition-[margin,opacity] duration-200", collapsed && "-mt-8 opacity-0")}>{g.label}</p>
            <ul className="grid gap-1">{g.keys.map((k) => item(`/admin/${k}`, titleOf(k), ICONS[k] ?? FileText))}</ul>
          </div>
        ))}
      </nav>

      {/* footer: the signed-in user */}
      <div className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" data-slot="sidebar-menu-button" className={cn("flex h-12 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[state=open]:bg-sidebar-accent", collapsed && "size-8 p-0")}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-xs font-medium uppercase">{email.slice(0, 2)}</span>
              <span className={cn("grid flex-1 leading-tight", collapsed && "sr-only")}>
                <span className="truncate font-medium">Admin</span>
                <span className="truncate text-xs text-muted-foreground">{email}</span>
              </span>
              <ChevronsUpDown className={cn("ml-auto size-4 text-muted-foreground", collapsed && "hidden")} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-(--radix-dropdown-menu-trigger-width) min-w-56" data-admin>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Signed in for 12 hours</DropdownMenuLabel>
            <DropdownMenuItem asChild><a href="/" target="_blank" rel="noopener"><ExternalLink /> View website</a></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => { void logout(); }}><LogOut /> Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
