import type React from "react";
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Navbar />
      <main className="flex h-full min-h-screen w-full items-center justify-center pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default RootLayout;
