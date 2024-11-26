"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Harley Street Institute. All rights reserved.
        </p>
        <Link 
          href="/admin" 
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}