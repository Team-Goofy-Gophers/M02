/* eslint-disable @typescript-eslint/only-throw-error */
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "~/server/auth";

const f = createUploadthing();

export const ourFileRouter = {
  file: f({
    "application/json": {
      maxFileCount: 10000000
    },
    image: {
      maxFileCount: 10000000
    },
    pdf: {
      maxFileCount: 10000000
    },
    text: {
      maxFileCount: 10000000
    },
  })
    .middleware(async () => {
      const session = await auth();

      if (!session) throw new UploadThingError("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      return {};
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
