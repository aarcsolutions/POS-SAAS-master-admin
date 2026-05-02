"use client";

import { ReactNode } from "react";
import NextTopLoader from "nextjs-toploader";

/**
 * Global Loader Provider
 * Currently acts as a wrapper, keeping architecture symmetric to KSR-ADMIN.
 * Can be extended to include global router-level progression bars such as nprogress.
 */
export default function LoaderProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <NextTopLoader 
        color="#2e4fd5"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #2e4fd5,0 0 5px #2e4fd5"
      />
      {children}
    </>
  );
}
