import assert from "node:assert/strict";
import test from "node:test";
import {
  LANGUAGE_STORAGE_KEY,
  detectLocale,
  isLocale,
  localizedHref,
  resolveLocale,
} from "../src/lib/language.ts";

test("manual language preferences use a stable, site-specific storage key", () => {
  assert.equal(LANGUAGE_STORAGE_KEY, "jacobstarheim-language");
});

test("only the two canonical locale strings are valid saved preferences", () => {
  for (const locale of ["no", "en"]) assert.equal(isLocale(locale), true);
  for (const value of [undefined, null, "", "nb", "nn", "EN", "en-US", "fr", " no ", false, 0, [], {}, ["en"]]) {
    assert.equal(isLocale(value), false, `unexpected valid locale: ${JSON.stringify(value)}`);
  }
});

test("browser preference order decides between English and Norwegian", () => {
  assert.equal(detectLocale(["en", "nb"]), "en");
  assert.equal(detectLocale(["en-GB", "nb-NO"]), "en");
  assert.equal(detectLocale(["nb-NO", "en-US"]), "no");
  assert.equal(detectLocale(["nn", "en"]), "no");
});

test("unsupported browser languages are skipped before choosing a supported preference", () => {
  assert.equal(detectLocale(["fr", "nb"]), "no");
  assert.equal(detectLocale(["de-DE", "fr-FR", "nn-NO", "en"]), "no");
  assert.equal(detectLocale(["fr", "en", "no"]), "en");
});

test("Norwegian, Bokmål, and Nynorsk language tags all select Norwegian", () => {
  for (const language of ["no", "no-NO", "nb", "nb-NO", "nn", "nn-NO", "NO", "NB-no", "nN-No"]) {
    assert.equal(detectLocale([language]), "no", language);
  }
});

test("English language tags match case-insensitively without broad prefix matching", () => {
  for (const language of ["en", "en-US", "en-GB", "EN", "eN-gb"]) {
    assert.equal(detectLocale([language, "nb"]), "en", language);
  }
  assert.equal(detectLocale(["english", "nb"]), "no");
  assert.equal(detectLocale(["nope", "en"]), "en");
});

test("missing or entirely unsupported browser preferences fall back to English", () => {
  for (const languages of [[], [""], ["fr"], ["de-DE", "sv-SE"], ["not-a-language"]]) {
    assert.equal(detectLocale(languages), "en", JSON.stringify(languages));
  }
});

test("detecting a language does not change the browser preference list", () => {
  const languages = Object.freeze(["fr", "nn-NO", "en"]);
  assert.equal(detectLocale(languages), "no");
  assert.deepEqual(languages, ["fr", "nn-NO", "en"]);
});

test("an explicit language URL wins over saved and browser preferences", () => {
  for (const pathname of ["/no", "/no/"]) {
    assert.equal(resolveLocale(pathname, "en", ["en"]), "no", pathname);
  }
  for (const pathname of ["/en", "/en/"]) {
    assert.equal(resolveLocale(pathname, "no", ["nb-NO"]), "en", pathname);
  }
});

test("a saved manual choice wins over browser preferences at the root", () => {
  assert.equal(resolveLocale("/", "en", ["no"]), "en");
  assert.equal(resolveLocale("/", "no", ["en"]), "no");
  assert.equal(resolveLocale("/", "no", []), "no");
});

test("invalid saved choices defer to browser preferences and the English fallback", () => {
  for (const saved of [undefined, null, "", "nb", "EN", "fr", "no-NO", {}, ["no"]]) {
    assert.equal(resolveLocale("/", saved, ["nn-NO"]), "no");
    assert.equal(resolveLocale("/", saved, ["en-US"]), "en");
    assert.equal(resolveLocale("/", saved, []), "en");
  }
});

test("similar-looking paths are not treated as explicit locale URLs", () => {
  for (const pathname of ["/english", "/nope", "/enough", "/no/project", "/en/project", "/EN", "/NO"]) {
    assert.equal(resolveLocale(pathname, "no", ["en"]), "no", pathname);
    assert.equal(resolveLocale(pathname, "en", ["nb"]), "en", pathname);
  }
});

test("localized links default to the chosen language root", () => {
  assert.equal(localizedHref("no"), "/no");
  assert.equal(localizedHref("en"), "/en");
});

test("switching languages preserves query parameters and the active anchor exactly", () => {
  assert.equal(localizedHref("en", "", "#nimmo"), "/en#nimmo");
  assert.equal(localizedHref("no", "?view=art", ""), "/no?view=art");
  assert.equal(
    localizedHref("en", "?source=profile&value=a%2Bb&value=c", "#om-meg"),
    "/en?source=profile&value=a%2Bb&value=c#om-meg",
  );
  assert.equal(localizedHref("no", "?q=%E2%9C%93", "#in5320"), "/no?q=%E2%9C%93#in5320");
});
