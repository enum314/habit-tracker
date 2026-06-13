import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const apps = ["web"];

for (const app of apps) {
  const examplePath = join(root, "apps", app, ".env.example");
  const envPath = join(root, "apps", app, ".env");

  if (!existsSync(examplePath)) {
    console.error(`Missing ${examplePath}`);
    process.exit(1);
  }

  copyFileSync(examplePath, envPath);
  console.log(`Created apps/${app}/.env`);
}
