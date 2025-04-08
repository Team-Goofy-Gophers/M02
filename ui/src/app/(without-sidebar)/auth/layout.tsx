import { redirect } from "next/navigation";
import type React from "react";
import { auth } from "~/server/auth";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  if (session) {
    redirect("/profile");
  }
  return children;
};

export default Layout;
