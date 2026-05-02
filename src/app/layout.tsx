import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import LoaderProvider from "@/components/providers/LoaderProvider";
import { QueryProvider } from "@/components/providers/query-provider";
import { UnsavedChangesDialog } from "@/components/ui/unsaved-changes-dialog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pos-ms Dashboard",
  description: "Enterprise level POS system administration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <LoaderProvider>
            {children}
          </LoaderProvider>
        </QueryProvider>
        <UnsavedChangesDialog />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
