"use client";

import { Excalidraw } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";
import type { ComponentPropsWithoutRef } from "react";

const ExcalidrawWrapper = (
  props: ComponentPropsWithoutRef<typeof Excalidraw>,
) => {
  return (
    <div
      style={{
        height: window.innerHeight * 0.9,
        width: window.innerWidth * 0.9,
      }}
    >
      <Excalidraw {...props}></Excalidraw>
    </div>
  );
};
export default ExcalidrawWrapper;
