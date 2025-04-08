import { TRPCReactProvider } from "~/trpc/react";

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "~/styles/globals.css";
import CONSTANTS from "~/constants";
import { Toaster } from "~/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${CONSTANTS.APP_NAME} - Intelligent Document Processing`,
  description:
    "Transform unstructured documents into tailored datasets with AI agents",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
  ],
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <TRPCReactProvider>
            {children}
            <Toaster />
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
