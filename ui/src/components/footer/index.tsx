import { FileText } from "lucide-react";
import Link from "next/link";
import React from "react";
import CONSTANTS from "~/constants";

const Footer = () => {
  return (
    <footer className="flex w-full justify-center border-t bg-white py-6">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <FileText className="text-primary h-5 w-5" />
            <span className="text-lg font-semibold">{CONSTANTS.APP_NAME}</span>
          </div>
          <div className="text-muted-foreground flex gap-8 text-sm">
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Contact
            </Link>
          </div>
          <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {CONSTANTS.APP_NAME}. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
