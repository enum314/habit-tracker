import { PropsWithChildren, Suspense } from "react";

import { Providers } from "./providers";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Providers>
      <Suspense>{children}</Suspense>
    </Providers>
  );
}
