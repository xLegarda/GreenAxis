# Fix: Upload 500 Error - ESM/CommonJS Conflict

## Root Cause

Dependency chain causes `ERR_REQUIRE_ESM` in production (Vercel):

```
isomorphic-dompurify@3.3.0
  → jsdom@29.0.0
    → html-encoding-sniffer
      → require("@exodus/bytes/encoding-lite.js")  ← CommonJS trying to load ESM-only module
```

`@exodus/bytes@1.15.0` is ESM-only (`"type": "module"`), but `html-encoding-sniffer` uses `require()`.

**Affected routes:** `/api/upload`, `/api/contacto` (both import `isomorphic-dompurify` server-side)

## Solution

Add `serverExternalPackages` to `next.config.ts` so Next.js doesn't bundle these packages through Turbopack/Webpack (loads them directly from node_modules, handling ESM/CJS correctly).

Also delete the duplicate `next.config.js`.

## Files to Modify

### 1. `next.config.ts` - Add serverExternalPackages

Add `serverExternalPackages: ['isomorphic-dompurify', 'jsdom']` to the config object.

### 2. Delete `next.config.js` - Remove duplicate config

Having both `.ts` and `.js` config files can cause issues. Next.js prefers `.ts` but the `.js` presence can cause confusion.

## Verification

1. Deploy to Vercel
2. Test uploading a file → should work without 500 error
3. Test sending a contact message → should work without 500 error
4. Check Vercel Function Logs → no `ERR_REQUIRE_ESM` errors
