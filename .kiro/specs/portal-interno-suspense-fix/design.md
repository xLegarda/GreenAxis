# Portal Interno Suspense Fix Design

## Overview

The Next.js build process fails when attempting to prerender the portal-interno page because `useSearchParams()` is called directly in the component without a Suspense boundary. This is a Next.js requirement for client components using dynamic APIs during static generation. The fix involves extracting the component logic into a separate content component and wrapping it with a Suspense boundary, following the same pattern already implemented in the restablecer page. This ensures the build completes successfully while maintaining all existing authentication, redirect, and UI functionality.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when Next.js attempts to prerender a page that calls `useSearchParams()` without a Suspense wrapper
- **Property (P)**: The desired behavior - the build process completes successfully and the page functions correctly at runtime
- **Preservation**: All existing authentication flows, redirect handling, form validation, and UI interactions that must remain unchanged
- **PortalInternoPage**: The default export component in `src/app/portal-interno/page.tsx` that currently calls `useSearchParams()` directly
- **useSearchParams()**: Next.js hook from `next/navigation` that accesses URL search parameters and requires a Suspense boundary during prerendering
- **Suspense boundary**: React component that provides a fallback UI while async operations complete, required by Next.js for dynamic APIs

## Bug Details

### Bug Condition

The bug manifests when Next.js attempts to build and prerender the portal-interno page. The `PortalInternoPage` component calls `useSearchParams()` directly without a Suspense wrapper, causing Next.js to fail during the static page generation phase with the error "useSearchParams() should be wrapped in a suspense boundary".

**Formal Specification:**
```
FUNCTION isBugCondition(buildContext)
  INPUT: buildContext of type NextJSBuildContext
  OUTPUT: boolean
  
  RETURN buildContext.phase == 'prerender'
         AND buildContext.page == 'portal-interno'
         AND componentCallsUseSearchParams(buildContext.component)
         AND NOT wrappedInSuspense(buildContext.component)
END FUNCTION
```

### Examples

- **Build Failure**: Running `npm run build` fails with error "useSearchParams() should be wrapped in a suspense boundary at /portal-interno" (current behavior)
- **Expected Success**: Running `npm run build` completes successfully and generates static pages without errors (expected behavior)
- **Runtime Behavior**: User navigates to `/portal-interno?redirect=/admin` and the page loads correctly with redirect parameter preserved (must remain unchanged)
- **Edge Case**: User navigates to `/portal-interno` without query parameters and the page defaults to `/admin` redirect (must remain unchanged)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Redirect parameter handling: accessing `/portal-interno?redirect=/admin` must continue to redirect to the specified path after authentication
- Authentication checking: the initial "Verificando..." loading state with Leaf icon must continue to display during auth verification
- Mode determination: the page must continue to correctly determine and display setup, login, or register modes based on account status
- Login flow: submitting credentials must continue to authenticate and redirect appropriately
- Setup flow: creating the initial admin account must continue to work and auto-login the user
- Register flow: creating additional accounts must continue to respect maxAccounts limit
- Password visibility toggle: clicking the eye icon must continue to show/hide password text
- Form validation: password mismatch and length validation must continue to display error messages
- UI rendering: all cards, buttons, icons, and styling must remain visually identical

**Scope:**
All runtime behavior of the portal-interno page should be completely unaffected by this fix. This includes:
- All user interactions (form submissions, button clicks, input changes)
- All API calls and authentication flows
- All state management and conditional rendering
- All error handling and success redirects

## Hypothesized Root Cause

Based on the bug description and Next.js documentation, the root cause is:

1. **Missing Suspense Wrapper**: The `PortalInternoPage` component directly exports a function that calls `useSearchParams()`, but Next.js requires this hook to be wrapped in a Suspense boundary during the prerendering phase to handle the async nature of search parameter access.

2. **Build-Time vs Runtime Difference**: During build time, Next.js attempts to statically generate pages. When it encounters `useSearchParams()` without Suspense, it cannot determine what fallback UI to show while parameters are being resolved, causing the build to fail.

3. **Pattern Already Exists**: The `restablecer` page in the same directory already implements the correct pattern by extracting logic into a `RestablecerContent` component and wrapping it with Suspense in the default export.

4. **Simple Refactor Required**: The fix requires minimal code changes - extract the existing component logic into a content component and wrap it with Suspense, exactly matching the pattern in `restablecer/page.tsx`.

## Correctness Properties

Property 1: Bug Condition - Build Process Completes Successfully

_For any_ Next.js build attempt where the portal-interno page is being prerendered, the build process SHALL complete successfully without errors, generating the static page with proper Suspense boundary handling for the useSearchParams() hook.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Runtime Behavior Unchanged

_For any_ user interaction with the portal-interno page at runtime (navigation, form submission, authentication, redirect handling), the fixed code SHALL produce exactly the same behavior as the original code, preserving all authentication flows, redirect parameter handling, form validation, UI rendering, and state management.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `src/app/portal-interno/page.tsx`

**Function**: `PortalInternoPage` (default export)

**Specific Changes**:
1. **Import Suspense**: Add `Suspense` to the React imports at the top of the file
   - Change: `import { useState, useEffect } from 'react'`
   - To: `import { useState, useEffect, Suspense } from 'react'`

2. **Rename Component**: Rename the current `PortalInternoPage` function to `PortalInternoContent`
   - This component will contain all the existing logic unchanged
   - It will be the component that actually uses `useSearchParams()`

3. **Create New Default Export**: Create a new `PortalInternoPage` function that wraps `PortalInternoContent` with Suspense
   - This becomes the new default export
   - Includes a fallback UI matching the existing "checking" mode loading state

4. **Fallback UI**: Use the same loading UI that already exists in the "checking" mode
   - Leaf icon with "Cargando..." text (matching the restablecer pattern)
   - Same gradient background and styling for consistency

5. **No Logic Changes**: All existing component logic, state management, API calls, and UI rendering remain completely unchanged inside `PortalInternoContent`

### Implementation Pattern

Follow the exact pattern from `src/app/portal-interno/restablecer/page.tsx`:

```typescript
// Content component with all existing logic
function PortalInternoContent() {
  // All existing code from current PortalInternoPage
  const searchParams = useSearchParams()
  // ... rest of existing implementation
}

// Default export with Suspense wrapper
export default function PortalInternoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Leaf className="h-12 w-12 text-primary" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    }>
      <PortalInternoContent />
    </Suspense>
  )
}
```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, verify the build failure on unfixed code to confirm the root cause, then verify the fix resolves the build issue and preserves all runtime behavior.

### Exploratory Bug Condition Checking

**Goal**: Confirm the build failure occurs on the UNFIXED code and understand the exact error message. This validates our root cause hypothesis.

**Test Plan**: Attempt to run `npm run build` on the unfixed code and observe the failure. Document the exact error message and stack trace to confirm it matches our hypothesis about missing Suspense boundary.

**Test Cases**:
1. **Build Failure Test**: Run `npm run build` on unfixed code (will fail with useSearchParams error)
2. **Error Message Validation**: Verify error message mentions "useSearchParams() should be wrapped in a suspense boundary"
3. **Page Identification**: Confirm error points to `/portal-interno` page specifically
4. **Dev Mode Check**: Verify page works in development mode with `npm run dev` (may work but build fails)

**Expected Counterexamples**:
- Build process fails during static page generation phase
- Error message explicitly mentions useSearchParams and Suspense boundary requirement
- Possible causes: missing Suspense wrapper, incorrect component structure, Next.js prerendering requirements

### Fix Checking

**Goal**: Verify that after applying the fix, the build process completes successfully without errors.

**Pseudocode:**
```
FOR ALL buildAttempts WHERE isBugCondition(buildContext) DO
  result := runBuild_fixed()
  ASSERT result.success == true
  ASSERT result.errors.length == 0
  ASSERT result.generatedPages.includes('/portal-interno')
END FOR
```

**Test Cases**:
1. **Build Success**: Run `npm run build` on fixed code and verify it completes without errors
2. **Static Generation**: Verify the portal-interno page is successfully generated in `.next` directory
3. **No Warnings**: Confirm no warnings about Suspense or useSearchParams in build output
4. **Production Build**: Verify `npm run start` serves the built page correctly

### Preservation Checking

**Goal**: Verify that all runtime behavior remains unchanged after the fix. The Suspense wrapper should only affect build-time behavior, not runtime functionality.

**Pseudocode:**
```
FOR ALL userInteractions WHERE NOT isBugCondition(interaction) DO
  ASSERT behavior_original(interaction) = behavior_fixed(interaction)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across different user flows
- It catches edge cases in authentication and redirect handling
- It provides strong guarantees that all runtime behavior is preserved

**Test Plan**: Test all user flows on both unfixed and fixed code to verify identical behavior. Focus on authentication, redirects, form validation, and UI interactions.

**Test Cases**:
1. **Redirect Preservation**: Navigate to `/portal-interno?redirect=/admin` and verify redirect works after login
2. **Default Redirect**: Navigate to `/portal-interno` without params and verify default `/admin` redirect
3. **Auth Check Preservation**: Verify "Verificando..." loading state displays during auth check
4. **Setup Mode**: Verify initial setup flow creates admin account and auto-logs in
5. **Login Mode**: Verify login with credentials authenticates and redirects correctly
6. **Register Mode**: Verify additional account creation respects maxAccounts limit
7. **Password Toggle**: Verify eye icon toggles password visibility
8. **Form Validation**: Verify password mismatch and length errors display correctly
9. **Error Handling**: Verify API errors display appropriate error messages
10. **UI Consistency**: Verify all styling, icons, and layout remain identical

### Unit Tests

- Test that Suspense fallback renders correctly during initial load
- Test that PortalInternoContent receives and uses searchParams correctly
- Test that all existing state management continues to work
- Test edge cases like missing redirect parameter, invalid auth states

### Property-Based Tests

- Generate random redirect URLs and verify they are preserved through authentication flow
- Generate random user credentials and verify login/setup flows work correctly
- Generate random account counts and verify maxAccounts logic works correctly
- Test that all form validation rules continue to work across many input combinations

### Integration Tests

- Test full authentication flow from page load to successful login with redirect
- Test setup flow from initial page load to admin account creation
- Test register flow from login mode to creating additional accounts
- Test that build process completes and production server serves page correctly
- Test that Suspense fallback displays briefly then transitions to actual content
