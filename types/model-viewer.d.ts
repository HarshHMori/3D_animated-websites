import React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "auto-rotate"?: boolean | string;
          "camera-controls"?: boolean | string;
          "rotation-per-second"?: string;
          "shadow-intensity"?: string;
          "camera-orbit"?: string;
          "field-of-view"?: string;
          "touch-action"?: string;
          "environment-image"?: string;
          "exposure"?: string;
          "ar"?: boolean | string;
          "ar-modes"?: string;
          "loading"?: string;
          "poster"?: string;
          "reveal"?: string;
        },
        HTMLElement
      >;
    }
  }
}
