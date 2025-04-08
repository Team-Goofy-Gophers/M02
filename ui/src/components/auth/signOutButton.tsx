"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";

const SignOutButton = () => {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      size="sm"
      onClick={async () => {
        toast.loading("Signing out...");
        await signOut();
        toast.dismiss();
        toast.success("Signed out successfully");
      }}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  );
};

export default SignOutButton;
