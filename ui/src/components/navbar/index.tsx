import React from "react";
import { Bell, FileText, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import CONSTANTS from "~/constants";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { auth } from "~/server/auth";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="fixed flex w-full justify-center border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="text-primary h-6 w-6" />
            <span className="text-xl font-semibold">{CONSTANTS.APP_NAME}</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/studio"
              className="text-muted-foreground hover:text-foreground text-sm font-medium"
            >
              Studio
            </Link>
            <Link
              href="/how-it-works"
              className="text-muted-foreground hover:text-foreground text-sm font-medium"
            >
              How it works
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          {session ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <Avatar asChild>
                <Link href="/profile">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="Avatar"
                  />
                  <AvatarFallback>PFP</AvatarFallback>
                </Link>
              </Avatar>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
