import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import "./globals.css";

export const metadata: Metadata = { title: "Youth-led Dialogue | Chấm điểm", description: "Công cụ tổng hợp điểm nội bộ" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" suppressHydrationWarning><body><header className="site-header"><div className="header-inner"><Link href="/" className="brand"><Image src={logo} alt="Youth-led Dialogue" priority /><strong>Hệ thống<br />tổng hợp điểm</strong></Link><nav className="nav"><Link href="/">Tổng quan</Link><Link href="/scores">Nhập điểm BGK</Link><Link href="/media">Truyền thông & Voting</Link><Link href="/results">Kết quả</Link></nav></div></header>{children}</body></html>;
}
