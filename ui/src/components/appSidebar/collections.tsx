"use client";

import Link from "next/link";
import React from "react";
import Loader from "~/components/loader";
import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import { api } from "~/trpc/react";

const Collections = () => {
  const {
    data: collections,
    isLoading,
    isError,
  } = api.collection.getCollectionsInfinitely.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.length === 10
          ? lastPage[lastPage.length - 1]!.id
          : null;
      },
    },
  );

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !collections) {
    return (
      <div className="flex h-full items-center justify-center">
        <h1 className="text-2xl font-bold">Error loading collections</h1>
      </div>
    );
  }

  return collections?.pages
    .flatMap((page) => page)
    .map((collection, idx) => (
      <SidebarMenuItem key={idx} className="flex items-center gap-2">
        <SidebarMenuButton
          tooltip={collection.name}
          className="hover:bg-primary/10 min-w-8 justify-between duration-200 ease-linear"
          asChild
        >
          <Link href={`/studio?collectionId=${collection.id}`}>
            <span>{collection.name}</span>
            <span>{collection._count.Documents}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
};

export default Collections;
