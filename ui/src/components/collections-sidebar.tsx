"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  FileText,
  FolderPlus,
  Search,
  ChevronRight,
  ChevronDown,
  Plus,
} from "lucide-react";

const collections = [
  {
    id: 1,
    name: "Financial Documents",
    count: 12,
    active: true,
  },
  {
    id: 2,
    name: "Contracts",
    count: 8,
    active: false,
  },
  {
    id: 3,
    name: "Invoices",
    count: 24,
    active: false,
  },
  {
    id: 4,
    name: "Customer Feedback",
    count: 16,
    active: false,
  },
  {
    id: 5,
    name: "Product Specifications",
    count: 6,
    active: false,
  },
];

export function CollectionsSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [items, setItems] = useState(collections);

  return (
    <div
      className={`border-r bg-white transition-all ${isOpen ? "w-64" : "w-16"}`}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        {isOpen ? (
          <>
            <h2 className="text-sm font-semibold">Collections</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="mx-auto"
            onClick={() => setIsOpen(true)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <>
          <div className="p-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input placeholder="Search collections..." className="pl-8" />
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-2">
            <h3 className="text-muted-foreground text-xs font-medium uppercase">
              My Collections
            </h3>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add collection</span>
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="space-y-1 p-2">
              {items.map((item) => (
                <Button
                  key={item.id}
                  variant={item.active ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span className="flex-1 truncate text-left">{item.name}</span>
                  <span className="text-muted-foreground ml-auto text-xs">
                    {item.count}
                  </span>
                </Button>
              ))}
            </div>
          </ScrollArea>

          <div className="absolute right-4 bottom-4 left-4">
            <Button className="w-full gap-2">
              <FolderPlus className="h-4 w-4" />
              New Collection
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
