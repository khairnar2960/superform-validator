import { execSync } from 'child_process';

const type = process.argv[2] || "patch"; // default to patch
execSync(`npm version ${type}`, { stdio: "inherit" });
execSync("npm run changelog", { stdio: "inherit" });
execSync("git push --follow-tags", { stdio: "inherit" });