import { TRPCReactProvider } from "~/trpc/react";

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "~/styles/globals.css";

import { ThemeProvider } from "~/components/providers/theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocuMind - Intelligent Document Processing",
  description:
    "Transform unstructured documents into tailored datasets with AI agents",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
