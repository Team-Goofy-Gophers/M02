"use client";
import { useSearchParams } from "next/navigation";
import Playground from "~/components/studio/playground";

const Page = () => {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get("collectionId");

  if (!collectionId) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <h1 className="text-2xl font-bold">Please select a collection</h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <Playground collectionId={collectionId} />
    </div>
  );
};

export default Page;
