"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Database, 
  MessageSquare, 
  ScrollText,
  Settings,
  Newspaper
} from "lucide-react";

const navItems = [
  {
    title: "Content",
    href: "/admin",
    icon: Database
  },
  {
    title: "System Prompt",
    href: "/admin/prompts",
    icon: MessageSquare
  },
  {
    title: "Response Rules",
    href: "/admin/rules",
    icon: ScrollText
  },
  {
    title: "News Rules",
    href: "/admin/news-rules",
    icon: Newspaper
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings
  }
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <ScrollArea className="py-6">
      <div className="flex flex-col gap-2 px-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "justify-start",
              pathname === item.href && "bg-muted"
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}