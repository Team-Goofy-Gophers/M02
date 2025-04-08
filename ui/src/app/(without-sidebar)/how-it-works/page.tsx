"use client";

import React from "react";
import dynamic from "next/dynamic";
import { api } from "~/trpc/react";
import type { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types";
import { toast } from "sonner";

const ExcalidrawWrapper = dynamic(
  async () => (await import("~/components/wrappers/excalidraw")).default,
  {
    ssr: false,
  },
);

const Page = () => {
  const howItWorks = api.appSettings.getHowItWorks.useQuery();
  const updateHowItWorks = api.appSettings.updateHowItWorks.useMutation();

  return (
    <ExcalidrawWrapper
      initialData={howItWorks.data?.howItWorks as ExcalidrawInitialDataState}
    />
  );
};

export default Page;
