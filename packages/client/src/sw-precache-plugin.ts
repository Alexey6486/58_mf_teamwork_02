import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

export function swPrecachePlugin(outDir: string): Plugin {
  return {
    name: 'sw-precache',
    apply: 'build',
    closeBundle() {
      const distClientDir = path.resolve(outDir);
      const swPath = path.join(distClientDir, 'sw.js');

      if (!fs.existsSync(swPath)) {
        return;
      }

      const urls = collectUrls(distClientDir, distClientDir);

      const swContent = fs.readFileSync(swPath, 'utf-8');
      const injected = swContent.replace(
        'self.__SW_PRECACHE_URLS__ || [\'/\']',
        JSON.stringify(urls)
      );

      fs.writeFileSync(swPath, injected, 'utf-8');
    },
  };
}

function collectUrls(baseDir: string, currentDir: string): string[] {
  const EXTENSIONS = new Set(['.js', '.css', '.html', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2']);
  const urls: string[] = [];

  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      urls.push(...collectUrls(baseDir, fullPath));
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      const relative = '/' + path.relative(baseDir, fullPath).replace(/\\/g, '/');
      if (relative !== '/sw.js') {
        urls.push(relative);
      }
    }
  }

  return urls;
}
