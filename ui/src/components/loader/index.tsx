import React from "react";
import { Loader as LucideLoader } from "lucide-react";

const Loader = () => {
  return (
    <div className="mt-2 flex h-full items-center justify-center">
      <LucideLoader className="animate-spin" />
    </div>
  );
};

export default Loader;
