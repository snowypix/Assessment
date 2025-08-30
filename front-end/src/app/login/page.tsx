"use client";

import { Suspense } from "react";
import SignInPage from "./signin";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <SignInPage />
    </Suspense>
  );
}
