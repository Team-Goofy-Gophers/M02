"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";

const SignUpButton = () => {
  return (
    <Button variant="ghost" className="w-full justify-start" size="sm" asChild>
      <Link href="/auth/signup">
        Sign up
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
};

export default SignUpButton;
