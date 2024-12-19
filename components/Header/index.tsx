"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./header.css";

type PageTitle = {
  [key: string]: string;
  "/": "Dashboard",
  "/locations": "ALL LOCATIONS"
};

const pageTitles: PageTitle = {
  "/": "Dashboard",
  "/locations": "ALL LOCATIONS"
};

export default function Header() {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || "";

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <Link href="/" className="logo">
            Kuyua
          </Link>
          {pageTitle && <div className="divider">|</div>}
          <h1 className="page-title">{pageTitle}</h1>
        </div>
      </div>
    </header>
  );
} 