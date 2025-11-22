import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const updateVersion = async () => {
    const filePath = path.resolve('README.md');
    const { default: config } = await import('../package.json', { with: { type: 'json' }});
    const data = fs.readFileSync(filePath, 'utf8');
    const updated = data.replace(/superform-validator@(\d\.\d\.\d)/g, 'superform-validator@'+config.version);
    fs.writeFileSync(filePath, updated, 'utf8');
    execSync("git add README.md", { stdio: "inherit" });
}

const type = process.argv[2] || "patch"; // default to patch
execSync(`npm version ${type}`, { stdio: "inherit" });
execSync("npm run changelog", { stdio: "inherit" });
execSync("git push --follow-tags", { stdio: "inherit" });
await updateVersion();
