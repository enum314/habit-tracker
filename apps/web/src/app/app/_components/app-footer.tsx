import { Year } from "@/components/year";

import { siteConfig } from "@/config/site";

export function AppFooter() {
  return (
    <footer className="border-border/60 mt-auto border-t py-6">
      <div className="text-muted-foreground container text-center text-sm">
        <p>
          &copy; <Year /> {siteConfig.company}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
