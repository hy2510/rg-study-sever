import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Study Readinggate",
  description: "학습 개발 전용 페이지",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body style={{ margin: "0" }}>{children}</body>
    </html>
  );
}
