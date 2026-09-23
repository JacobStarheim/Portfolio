import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createArtRevision } from '../src/build/art-revision.ts';

const revision = createArtRevision('out/art');
const productionOrigin = 'https://jacobstarheim.no';

function verifyProductionMetadata(html, path) {
  if (process.env.VERCEL_ENV !== 'production') return;
  const pageUrl = `${productionOrigin}${path}`;
  const route = path || '/';
  assert.ok(html.includes(`<link rel="canonical" href="${pageUrl}"`), `${route}: canonical uses the production domain`);
  for (const [language, alternatePath] of [['nb', '/no'], ['en', '/en'], ['x-default', '']]) {
    assert.ok(html.includes(`<link rel="alternate" hrefLang="${language}" href="${productionOrigin}${alternatePath}"`), `${route}: ${language} alternate uses the production domain`);
  }
  assert.ok(html.includes(`<meta property="og:url" content="${pageUrl}"`), `${route}: Open Graph URL uses the production domain`);
  assert.ok(html.includes(`<meta property="og:image" content="${productionOrigin}/art/chess.webp?v=${revision}"`), `${route}: Open Graph image uses the production domain and current artwork revision`);
}

const anchors = ['arbeid', 'nimmo-traveller', 'nimmo-driver', 'utdanning', 'in5320', 'hobbyprosjekter', 'open-bfme', 'aipodcast', 'sjakk', 'om-meg'];
for (const [locale, language, heading] of [['no', 'nb', 'Mobilutvikling hos NIMMO'], ['en', 'en', 'Mobile development at NIMMO']]) {
  const html = await readFile(`out/${locale}.html`, 'utf8');
  verifyProductionMetadata(html, `/${locale}`);
  assert.ok(html.includes(`<html lang="${language}"`), `${locale}: correct server-rendered document language`);
  assert.ok(html.includes(heading), `${locale}: correct content without JavaScript`);
  assert.doesNotMatch(html, /NYSGJERRIGPER|CURIOUS MIND/, `${locale}: removed introductory label stays absent`);
  assert.match(html, new RegExp(`<link rel="canonical" href="[^\"]+/${locale}"`));
  for (const lang of ['nb', 'en', 'x-default']) assert.ok(html.includes(`hrefLang="${lang}"`), `${locale}: alternate ${lang}`);
  for (const id of anchors) assert.ok(html.includes(`id="${id}"`), `${locale}: stable #${id} anchor`);
  const images = [...html.matchAll(/(?:src|srcSet)="(\/art\/[^\"]+)"/g)].map(match => match[1]);
  assert.equal(images.length, 20, `${locale}: both resolutions of all ten artworks`);
  assert.ok(images.every(url => url.endsWith(`?v=${revision}`)), `${locale}: shared current artwork revision`);
  for (const destination of ['id1672565306', 'id6748903380', 'id=no.nimmo.app', 'id=no.nimmo.driver', 'mailto:jacobvinstar@gmail.com']) {
    assert.ok(html.includes(destination), `${locale}: preserved ${destination}`);
  }
  assert.ok(html.includes('href="/no"') && html.includes('href="/en"'), `${locale}: language links without JavaScript`);
}
const entry = await readFile('out/index.html', 'utf8');
verifyProductionMetadata(entry, '');
assert.ok(entry.includes('href="/no"') && entry.includes('href="/en"'), 'neutral entry has no-JavaScript fallback links');
assert.ok(!entry.includes('class="gallery"'), 'no wrong-language portfolio rendered before detection');
console.log('Localized export verified: /, /no, /en; metadata, anchors, store links and all versioned artwork.');
