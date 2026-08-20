import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL ?? 'https://rndyt.example';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  build: {
    format: 'directory'
  }
});
