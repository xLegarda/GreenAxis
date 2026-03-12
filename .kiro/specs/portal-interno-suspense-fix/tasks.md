# Implementation Plan

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Build Process Completes Successfully
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to the concrete failing case - building the portal-interno page
  - Test that `npm run build` completes successfully for the portal-interno page
  - The test should verify: build succeeds, no errors about useSearchParams, static page is generated
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS with error "useSearchParams() should be wrapped in a suspense boundary" (this is correct - it proves the bug exists)
  - Document counterexamples found: exact error message, build phase where it fails, stack trace
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Runtime Behavior Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for runtime interactions (dev mode with `npm run dev`)
  - Write property-based tests capturing observed behavior patterns:
    - Redirect parameter handling: `/portal-interno?redirect=/admin` preserves redirect after auth
    - Default redirect: `/portal-interno` defaults to `/admin` redirect
    - Auth check: "Verificando..." loading state displays during verification
    - Setup mode: initial admin account creation and auto-login works
    - Login mode: credential authentication and redirect works
    - Register mode: additional account creation respects maxAccounts limit
    - Password toggle: eye icon shows/hides password text
    - Form validation: password mismatch and length errors display
    - UI consistency: all styling, icons, and layout remain identical
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code in dev mode
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 3. Fix for portal-interno Suspense boundary

  - [ ] 3.1 Implement the fix
    - Import Suspense from React: Add `Suspense` to React imports
    - Rename current `PortalInternoPage` to `PortalInternoContent`
    - Create new `PortalInternoPage` default export that wraps `PortalInternoContent` with Suspense
    - Add fallback UI matching existing "checking" mode: Leaf icon with "Cargando..." text and gradient background
    - Follow exact pattern from `src/app/portal-interno/restablecer/page.tsx`
    - Ensure all existing logic remains unchanged inside `PortalInternoContent`
    - _Bug_Condition: isBugCondition(buildContext) where buildContext.phase == 'prerender' AND componentCallsUseSearchParams() AND NOT wrappedInSuspense()_
    - _Expected_Behavior: Build process completes successfully without errors, static page is generated_
    - _Preservation: All runtime behavior (authentication, redirects, form validation, UI) remains unchanged_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Build Process Completes Successfully
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed - build completes successfully)
    - _Requirements: 2.1, 2.2_

  - [ ] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Runtime Behavior Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions in runtime behavior)
    - Confirm all tests still pass after fix (authentication, redirects, forms, UI all work identically)

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
