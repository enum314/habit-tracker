import { spawnSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  ".turbo",
  ".source",
  "generated",
]);

const SKIP_DIR_SUFFIXES = ["src/server/prisma"];

const SKIP_PATH_PREFIXES = [
  join(root, ".cursor", "skills"),
  join(root, ".github", "skills"),
];

const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".json",
  ".yaml",
  ".yml",
  ".css",
  ".md",
  ".mdx",
]);

const TEXT_FILENAMES = new Set([
  "Dockerfile",
  "pnpm-lock.yaml",
  ".npmrc",
  "vercel.json",
]);

const SCOPE_PATTERN = /^[a-z][a-z0-9-]*$/;

function parseArgs(argv) {
  const args = argv[0] === "--" ? argv.slice(1) : argv;
  let scope;
  let displayName;
  let dryRun = false;
  let yes = false;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (arg === "--yes") {
      yes = true;
      continue;
    }

    if (arg === "--display-name") {
      displayName = args[i + 1];
      if (!displayName) {
        throw new Error("--display-name requires a value.");
      }
      i += 1;
      continue;
    }

    if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    if (!scope) {
      scope = arg.replace(/^@/, "");
      continue;
    }

    throw new Error(`Unexpected argument: ${arg}`);
  }

  if (!scope) {
    throw new Error(
      'Usage: pnpm rename:template -- <scope> [--display-name "Acme"] [--dry-run] [--yes]',
    );
  }

  return {
    scope,
    displayName: displayName ?? scopeToDisplayName(scope),
    dryRun,
    yes,
  };
}

function scopeToDisplayName(scope) {
  return scope
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function detectCurrentScope() {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const match = pkg.name?.match(/^(.+)-monorepo$/);

  if (!match) {
    throw new Error(
      `Could not detect scope from package name "${pkg.name}". Expected "{scope}-monorepo".`,
    );
  }

  return match[1];
}

function detectCurrentDisplayName(currentScope) {
  const sitePath = join(root, "apps/web/src/config/site.ts");

  if (existsSync(sitePath)) {
    const content = readFileSync(sitePath, "utf8");
    const match = content.match(/name:\s*"([^"]+)"/);

    if (match) {
      return match[1];
    }
  }

  return scopeToDisplayName(currentScope);
}

function shouldSkipDir(dirPath, dirName) {
  if (SKIP_DIRS.has(dirName)) {
    return true;
  }

  return SKIP_DIR_SUFFIXES.some((suffix) => dirPath.endsWith(suffix));
}

function shouldSkipPath(filePath) {
  if (filePath === join(root, "scripts", "rename-template.mjs")) {
    return true;
  }

  return SKIP_PATH_PREFIXES.some((prefix) => filePath.startsWith(prefix));
}

function isTextFile(filePath, fileName) {
  if (TEXT_FILENAMES.has(fileName)) {
    return true;
  }

  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex === -1) {
    return false;
  }

  return TEXT_EXTENSIONS.has(fileName.slice(dotIndex));
}

function buildReplacements(fromScope, toScope, fromDisplayName, toDisplayName) {
  return [
    [`@${fromScope}/`, `@${toScope}/`],
    [`${fromScope}-monorepo`, `${toScope}-monorepo`],
    [`${fromScope}-web-ci`, `${toScope}-web-ci`],
    [`/root/${fromScope}`, `/root/${toScope}`],
    [`# ${fromDisplayName} Monorepo`, `# ${toDisplayName} Monorepo`],
    [
      `for the ${fromDisplayName} platform`,
      `for the ${toDisplayName} platform`,
    ],
    [`name: "${fromDisplayName}",`, `name: "${toDisplayName}",`],
    [
      `Run the ${fromDisplayName} template locally.`,
      `Run the ${toDisplayName} template locally.`,
    ],
    [
      `How the ${fromDisplayName} template is organized.`,
      `How the ${toDisplayName} template is organized.`,
    ],
    // Legacy fallbacks for templates that still use Dynamic identifiers.
    ["@dynamic/", `@${toScope}/`],
    ["dynamic-monorepo", `${toScope}-monorepo`],
    ["dynamic-web-ci", `${toScope}-web-ci`],
    ["/root/dynamic", `/root/${toScope}`],
    ["# Dynamic Monorepo", `# ${toDisplayName} Monorepo`],
    ["for the Dynamic platform", `for the ${toDisplayName} platform`],
    ['name: "Dynamic",', `name: "${toDisplayName}",`],
    [
      "Run the Dynamic template locally.",
      `Run the ${toDisplayName} template locally.`,
    ],
    [
      "How the Dynamic template is organized.",
      `How the ${toDisplayName} template is organized.`,
    ],
  ];
}

function applyReplacements(content, replacements) {
  let next = content;

  for (const [from, to] of replacements) {
    next = next.replaceAll(from, to);
  }

  return next;
}

function walkFiles(dirPath, files = []) {
  if (shouldSkipPath(dirPath)) {
    return files;
  }

  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const entryPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkipDir(entryPath, entry.name)) {
        continue;
      }

      walkFiles(entryPath, files);
      continue;
    }

    if (!entry.isFile() || !isTextFile(entryPath, entry.name)) {
      continue;
    }

    if (shouldSkipPath(entryPath)) {
      continue;
    }

    files.push(entryPath);
  }

  return files;
}

async function confirm(message) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await rl.question(`${message} [y/N] `);
  rl.close();

  return answer.trim().toLowerCase() === "y";
}

function renameWorkflowFiles(fromScope, toScope, dryRun) {
  const workflowDir = join(root, ".github", "workflows");
  const renamed = [];

  if (!existsSync(workflowDir)) {
    return renamed;
  }

  for (const fileName of readdirSync(workflowDir)) {
    if (!fileName.startsWith(`${fromScope}-`) || !fileName.endsWith(".yml")) {
      continue;
    }

    const fromPath = join(workflowDir, fileName);
    const suffix = fileName.slice(fromScope.length + 1);
    const toPath = join(workflowDir, `${toScope}-${suffix}`);

    if (dryRun) {
      renamed.push({
        from: relative(root, fromPath),
        to: relative(root, toPath),
      });
      continue;
    }

    renameSync(fromPath, toPath);
    renamed.push({
      from: relative(root, fromPath),
      to: relative(root, toPath),
    });
  }

  // Legacy workflow names from older templates.
  for (const fileName of ["dynamic-web-ci.yml"]) {
    const fromPath = join(workflowDir, fileName);
    if (!existsSync(fromPath)) {
      continue;
    }

    const suffix = fileName.replace(/^dynamic-/, "");
    const toPath = join(workflowDir, `${toScope}-${suffix}`);

    if (dryRun) {
      renamed.push({
        from: relative(root, fromPath),
        to: relative(root, toPath),
      });
      continue;
    }

    renameSync(fromPath, toPath);
    renamed.push({
      from: relative(root, fromPath),
      to: relative(root, toPath),
    });
  }

  return renamed;
}

function runPnpmInstall(dryRun) {
  if (dryRun) {
    console.log("\nWould run: pnpm install");
    return;
  }

  console.log("\nRunning pnpm install...");
  const result = spawnSync("pnpm", ["install"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function main() {
  let options;

  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  const { scope: toScope, displayName: toDisplayName, dryRun, yes } = options;
  const fromScope = detectCurrentScope();
  const fromDisplayName = detectCurrentDisplayName(fromScope);

  if (toScope === fromScope) {
    console.error(
      `Scope must be different from the current scope "${fromScope}".`,
    );
    process.exit(1);
  }

  if (!SCOPE_PATTERN.test(toScope)) {
    console.error(
      `Invalid scope "${toScope}". Use lowercase letters, numbers, and hyphens only.`,
    );
    process.exit(1);
  }

  const replacements = buildReplacements(
    fromScope,
    toScope,
    fromDisplayName,
    toDisplayName,
  );
  const files = walkFiles(root);
  const pendingChanges = [];

  for (const filePath of files) {
    const original = readFileSync(filePath, "utf8");
    const updated = applyReplacements(original, replacements);

    if (updated === original) {
      continue;
    }

    pendingChanges.push({
      filePath,
      relativePath: relative(root, filePath),
      updated,
    });
  }

  const renamedWorkflows = renameWorkflowFiles(fromScope, toScope, true);

  console.log(`From scope: @${fromScope}/`);
  console.log(`To scope: @${toScope}/`);
  console.log(`From display name: ${fromDisplayName}`);
  console.log(`To display name: ${toDisplayName}`);
  console.log(`Mode: ${dryRun ? "dry-run" : "apply"}`);
  console.log(`\nContent changes: ${pendingChanges.length} file(s)`);

  if (pendingChanges.length > 0) {
    for (const { relativePath } of pendingChanges.sort((a, b) =>
      a.relativePath.localeCompare(b.relativePath),
    )) {
      console.log(`  ${dryRun ? "would update" : "updated"} ${relativePath}`);
    }
  }

  if (renamedWorkflows.length > 0) {
    console.log(`\nWorkflow renames: ${renamedWorkflows.length} file(s)`);
    for (const { from, to } of renamedWorkflows) {
      console.log(`  ${dryRun ? "would rename" : "renamed"} ${from} -> ${to}`);
    }
  }

  if (pendingChanges.length === 0 && renamedWorkflows.length === 0) {
    console.log("\nNo template identifiers found to rename.");
    process.exit(0);
  }

  if (dryRun) {
    console.log(
      "\nDry run complete. Re-run without --dry-run to apply changes.",
    );
    return;
  }

  if (!yes) {
    const proceed = await confirm("\nApply these changes?");
    if (!proceed) {
      console.log("Aborted.");
      process.exit(0);
    }
  }

  for (const { filePath, updated } of pendingChanges) {
    writeFileSync(filePath, updated, "utf8");
  }

  renameWorkflowFiles(fromScope, toScope, false);

  runPnpmInstall(false);

  console.log("\nTemplate rename complete.");
  console.log("Next steps:");
  console.log("  1. Review git diff");
  console.log(
    "  2. Update company/email in apps/*/src/config/site.ts if needed",
  );
  console.log("  3. Run pnpm typecheck && pnpm build");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
