# Bugfix Requirements Document

## Introduction

The Next.js build process fails when attempting to build the portal-interno page because `useSearchParams()` from `next/navigation` is used without a Suspense boundary wrapper. This is a requirement in Next.js for client components that use dynamic APIs during the prerendering phase. The fix must wrap the component using `useSearchParams()` in a Suspense boundary while maintaining all existing authentication and login functionality.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the Next.js build process attempts to prerender the portal-interno page THEN the build fails with error "useSearchParams() should be wrapped in a suspense boundary"

1.2 WHEN the PortalInternoPage component calls `useSearchParams()` directly without a Suspense wrapper THEN Next.js cannot complete the static page generation phase

### Expected Behavior (Correct)

2.1 WHEN the Next.js build process attempts to prerender the portal-interno page THEN the build SHALL complete successfully without errors

2.2 WHEN the PortalInternoPage component needs to access search parameters THEN it SHALL be wrapped in a Suspense boundary with an appropriate fallback UI

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user accesses the portal-interno page with a redirect parameter (e.g., `/portal-interno?redirect=/admin`) THEN the system SHALL CONTINUE TO redirect to the specified path after successful authentication

3.2 WHEN the page is in 'checking' mode during authentication verification THEN the system SHALL CONTINUE TO display the loading state with the Leaf icon and "Verificando..." text

3.3 WHEN the page determines the authentication mode (setup, login, or register) THEN the system SHALL CONTINUE TO display the appropriate form and UI elements

3.4 WHEN a user submits login credentials THEN the system SHALL CONTINUE TO authenticate and redirect to the appropriate page

3.5 WHEN a user creates an initial admin account in setup mode THEN the system SHALL CONTINUE TO create the account and automatically log them in

3.6 WHEN the page checks if additional accounts can be created THEN the system SHALL CONTINUE TO respect the maxAccounts limit and display the register option accordingly

3.7 WHEN a user toggles password visibility THEN the system SHALL CONTINUE TO show/hide the password text

3.8 WHEN form validation fails (e.g., passwords don't match, password too short) THEN the system SHALL CONTINUE TO display appropriate error messages
