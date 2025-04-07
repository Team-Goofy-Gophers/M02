import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { FileText, Bell, Search, Settings } from "lucide-react";

export function StudioHeader() {
  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="text-primary h-6 w-6" />
            <span className="text-xl font-semibold">DocuMind</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/studio"
              className="text-foreground text-sm font-medium"
            >
              Studio
            </Link>
            <Link
              href="/profile"
              className="text-muted-foreground hover:text-foreground text-sm font-medium"
            >
              Profile
            </Link>
            <Link
              href="/help"
              className="text-muted-foreground hover:text-foreground text-sm font-medium"
            >
              Help
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <Avatar>
            <AvatarImage
              src="/placeholder.svg?height=32&width=32"
              alt="Avatar"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
