"use client";

import * as React from "react";
import {
  CircleHelp,
  Contact,
  FileText,
  MoreVerticalIcon,
  PencilRuler,
  PlusCircleIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "~/components/ui/sidebar";
import Link from "next/link";
import CONSTANTS from "~/constants";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import SignOutButton from "~/components/auth/signOutButton";
import SignUpButton from "~/components/auth/signUpButton";
import Collections from "~/components/appSidebar/collections";
import { api } from "~/trpc/react";
import { toast } from "sonner";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { data: session } = useSession();

  const createCollection = api.collection.createCollection.useMutation();
  const apiUtils = api.useUtils();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/" className="flex items-center gap-2">
                <FileText className="text-primary size-6" />
                <span className="text-xl font-semibold">
                  {CONSTANTS.APP_NAME}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Profile" asChild>
                  <Link href="/profile">
                    <Contact />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Studio" asChild>
                  <Link href="/studio">
                    <PencilRuler />
                    <span>Studio</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="How it works" asChild>
                  <Link href="/how-it-works">
                    <CircleHelp />
                    <span>How it works</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarSeparator />
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 justify-between duration-200 ease-linear"
                  onClick={() => {
                    toast.loading("Creating new collection...");
                    createCollection.mutate(undefined, {
                      onSuccess: () => {
                        toast.dismiss();
                        toast.success("New collection created");
                        void apiUtils.collection.getCollectionsInfinitely.refetch();
                      },
                      onError: () => {
                        toast.dismiss();
                        toast.error("Failed to create new collection");
                      },
                    });
                  }}
                >
                  <span>New Collection</span>
                  <PlusCircleIcon />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collections />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {session ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={
                          session.user.image ??
                          "/placeholder.svg?height=36&width=36"
                        }
                        alt={session.user.name + "Avatar"}
                      />
                      <AvatarFallback className="rounded-lg">
                        PFP
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {session.user.name}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {session.user.email}
                      </span>
                    </div>
                    <MoreVerticalIcon className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="top"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem asChild>
                    <SignOutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <SignUpButton />
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
