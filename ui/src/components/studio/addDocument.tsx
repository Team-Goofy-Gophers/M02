"use client";

import React, { type ComponentPropsWithoutRef } from "react";
import { UploadDropzone } from "~/components/uploadthing";
import { toast } from "sonner";
import { api } from "~/trpc/react";

const AddDocument = ({
  collectionId,
  className,
}: {
  collectionId: string;
  className?: string;
}) => {
  const addDocument = api.collection.addDocument.useMutation();

  return (
    <UploadDropzone
      className={className}
      endpoint="file"
      onClientUploadComplete={async (res) => {
        toast.loading("Uploading files...");
        try {
          await Promise.all(
            res.map((file) =>
              addDocument.mutateAsync({
                collectionId: collectionId,
                documentId: file.ufsUrl,
              }),
            ),
          );
          toast.dismiss();
          toast.success("Files uploaded successfully!");
        } catch (error) {
          console.log(error);
          toast.dismiss();
          toast.error("Error uploading files");
        }
      }}
    />
  );
};

export default AddDocument;
