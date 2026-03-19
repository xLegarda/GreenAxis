# Authentication System

<cite>
**Referenced Files in This Document**
- [auth.ts](file://src/lib/auth.ts)
- [middleware.ts](file://src/middleware.ts)
- [login/route.ts](file://src/app/api/auth/login/route.ts)
- [logout/route.ts](file://src/app/api/auth/logout/route.ts)
- [check/route.ts](file://src/app/api/auth/check/route.ts)
- [reset-password/route.ts](file://src/app/api/auth/reset-password/route.ts)
- [setup/route.ts](file://src/app/api/auth/setup/route.ts)
- [delete-account/route.ts](file://src/app/api/auth/delete-account/route.ts)
- [schema.prisma](file://prisma/schema.prisma)
- [db.ts](file://src/lib/db.ts)
- [recuperar-clave/page.tsx](file://src/app/portal-interno/recuperar-clave/page.tsx)
- [restablecer/page.tsx](file://src/app/portal-interno/restablecer/page.tsx)
- [package.json](file://package.json)
</cite>

## Update Summary
**Changes Made**
- Enhanced session security with IP address verification and user agent validation
- Updated verifySession function to include comprehensive IP and user agent validation
- Improved IP address extraction from HTTP headers with fallback mechanisms
- Strengthened session security monitoring with real-time validation
- Modified session cookie storage to include IP and user agent information

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Security Measures](#security-measures)
9. [Troubleshooting Guide](#troubleshooting-guide)
10. [Conclusion](#conclusion)

## Introduction
This document describes the authentication system for GreenAxis, focusing on bcrypt password hashing with 12 rounds, session-based authentication with secure cookie management, user registration flow, and password reset functionality. The system now includes enhanced security measures with IP address verification and user agent validation for session management, providing robust protection against session hijacking and unauthorized access attempts. It explains the authentication middleware, login/logout endpoints, session token generation and expiration handling, secure cookie attributes, user validation, credential verification, and authentication state management. It also covers security measures against brute force attacks, session hijacking prevention, and secure password handling practices.

## Project Structure
The authentication system spans backend API routes, shared authentication utilities, database models, and frontend pages for password reset. Key areas:
- Backend utilities: password hashing, session creation/verification with enhanced security, admin operations
- API endpoints: login, logout, check, reset-password, setup, delete-account
- Database models: Admin and PasswordResetToken
- Frontend pages: password reset initiation and completion flows

```mermaid
graph TB
subgraph "Frontend"
RC["Recuperar Clave Page<br/>(/portal-interno/recuperar-clave)"]
RP["Restablecer Page<br/>(/portal-interno/restablecer)"]
end
subgraph "Backend"
M["Middleware<br/>(security headers)"]
L["Login Route<br/>(/api/auth/login)"]
LOG["Logout Route<br/>(/api/auth/logout)"]
C["Check Route<br/>(/api/auth/check)"]
R["Reset Password Route<br/>(/api/auth/reset-password)"]
S["Setup Route<br/>(/api/auth/setup)"]
D["Delete Account Route<br/>(/api/auth/delete-account)"]
AU["Auth Utilities<br/>(src/lib/auth.ts)"]
DB["Database Client<br/>(src/lib/db.ts)"]
end
RC --> R
RP --> R
M --> L
M --> LOG
M --> C
M --> R
M --> S
M --> D
L --> AU
LOG --> AU
C --> AU
R --> DB
S --> AU
D --> AU
AU --> DB
```

**Diagram sources**
- [middleware.ts:1-58](file://src/middleware.ts#L1-L58)
- [login/route.ts:1-91](file://src/app/api/auth/login/route.ts#L1-L91)
- [logout/route.ts:1-13](file://src/app/api/auth/logout/route.ts#L1-L13)
- [check/route.ts:1-21](file://src/app/api/auth/check/route.ts#L1-L21)
- [reset-password/route.ts:1-262](file://src/app/api/auth/reset-password/route.ts#L1-L262)
- [setup/route.ts:1-63](file://src/app/api/auth/setup/route.ts#L1-L63)
- [delete-account/route.ts:1-43](file://src/app/api/auth/delete-account/route.ts#L1-L43)
- [auth.ts:1-175](file://src/lib/auth.ts#L1-L175)
- [db.ts:1-21](file://src/lib/db.ts#L1-L21)

**Section sources**
- [auth.ts:1-175](file://src/lib/auth.ts#L1-L175)
- [login/route.ts:1-91](file://src/app/api/auth/login/route.ts#L1-L91)
- [logout/route.ts:1-13](file://src/app/api/auth/logout/route.ts#L1-L13)
- [check/route.ts:1-21](file://src/app/api/auth/check/route.ts#L1-L21)
- [reset-password/route.ts:1-262](file://src/app/api/auth/reset-password/route.ts#L1-L262)
- [setup/route.ts:1-63](file://src/app/api/auth/setup/route.ts#L1-L63)
- [delete-account/route.ts:1-43](file://src/app/api/auth/delete-account/route.ts#L1-L43)
- [middleware.ts:1-58](file://src/middleware.ts#L1-L58)
- [schema.prisma:200-222](file://prisma/schema.prisma#L200-L222)
- [db.ts:1-21](file://src/lib/db.ts#L1-L21)

## Core Components
- Password hashing and verification: bcrypt with 12 rounds
- Session management: secure cookie with httpOnly, secure, sameSite strict, 7-day expiry, IP and user agent validation
- Admin operations: existence checks, counting, creation, deletion with limits
- Authentication utilities: token generation, session lifecycle, current admin retrieval with enhanced security
- Database models: Admin and PasswordResetToken with appropriate constraints

Key implementation references:
- bcrypt configuration and helpers: [auth.ts:6-18](file://src/lib/auth.ts#L6-L18)
- session cookie attributes and lifecycle with IP/user agent: [auth.ts:26-50](file://src/lib/auth.ts#L26-L50)
- enhanced session verification with validation: [auth.ts:52-89](file://src/lib/auth.ts#L52-L89)
- admin creation and validation: [auth.ts:123-155](file://src/lib/auth.ts#L123-L155)
- reset token generation and storage: [reset-password/route.ts:10-167](file://src/app/api/auth/reset-password/route.ts#L10-L167)
- rate limiting and brute force protection: [login/route.ts:4-7](file://src/app/api/auth/login/route.ts#L4-L7)

**Section sources**
- [auth.ts:6-18](file://src/lib/auth.ts#L6-L18)
- [auth.ts:26-50](file://src/lib/auth.ts#L26-L50)
- [auth.ts:52-89](file://src/lib/auth.ts#L52-L89)
- [auth.ts:123-155](file://src/lib/auth.ts#L123-L155)
- [reset-password/route.ts:10-167](file://src/app/api/auth/reset-password/route.ts#L10-L167)
- [login/route.ts:4-7](file://src/app/api/auth/login/route.ts#L4-L7)

## Architecture Overview
The authentication system follows a layered architecture with enhanced security measures:
- Middleware applies security headers to all requests
- API routes handle authentication operations with IP extraction
- Shared auth utilities encapsulate cryptographic, session logic, and security validation
- Database models define Admin and PasswordResetToken entities
- Frontend pages trigger password reset workflows via API calls

```mermaid
sequenceDiagram
participant Client as "Client Browser"
participant MW as "Middleware"
participant API as "Auth API Routes"
participant Util as "Auth Utilities"
participant DB as "Database"
Client->>MW : Request with security headers
MW-->>Client : Response with security headers
Client->>API : POST /api/auth/login
API->>API : Extract IP from headers (x-real-ip/x-forwarded-for)
API->>Util : authenticateAdmin(email, password)
Util->>DB : findUnique({ email })
DB-->>Util : Admin record or null
Util-->>API : { id, email, name } or null
API->>Util : createSession(adminId, ip)
Util->>Util : generateSessionToken()
Util->>Util : Store IP and user-agent in cookie
Util->>DB : optional session persistence
Util-->>API : token
API-->>Client : JSON { success, admin } with Set-Cookie
Client->>API : GET /api/auth/check
API->>Util : getCurrentAdmin()
Util->>Util : verifySession() with IP/user-agent validation
Util->>DB : findUnique({ id }) via session
DB-->>Util : Admin record
Util-->>API : Admin info
API-->>Client : JSON { authenticated, admin }
Client->>API : POST /api/auth/logout
API->>Util : destroySession()
Util-->>API : void
API-->>Client : JSON { success }
```

**Diagram sources**
- [middleware.ts:1-58](file://src/middleware.ts#L1-L58)
- [login/route.ts:1-91](file://src/app/api/auth/login/route.ts#L1-L91)
- [check/route.ts:1-21](file://src/app/api/auth/check/route.ts#L1-L21)
- [logout/route.ts:1-13](file://src/app/api/auth/logout/route.ts#L1-L13)
- [auth.ts:26-50](file://src/lib/auth.ts#L26-L50)
- [auth.ts:52-89](file://src/lib/auth.ts#L52-L89)
- [db.ts:1-21](file://src/lib/db.ts#L1-L21)

## Detailed Component Analysis

### Password Hashing and Verification
- bcrypt is configured with 12 rounds for password hashing and comparison
- Hashing occurs during admin creation and password reset
- Verification is used during login to authenticate credentials

Implementation highlights:
- Hashing function: [auth.ts:11-13](file://src/lib/auth.ts#L11-L13)
- Verification function: [auth.ts:16-18](file://src/lib/auth.ts#L16-L18)
- Reset password hashing: [reset-password/route.ts:242](file://src/app/api/auth/reset-password/route.ts#L242)

**Section sources**
- [auth.ts:11-18](file://src/lib/auth.ts#L11-L18)
- [reset-password/route.ts:242](file://src/app/api/auth/reset-password/route.ts#L242)

### Enhanced Session-Based Authentication and Secure Cookies
- Session token generation uses cryptographically secure random bytes
- Sessions stored in a signed cookie with:
  - httpOnly: prevents XSS reading
  - secure: transmitted over HTTPS in production
  - sameSite strict: mitigates CSRF
  - 7-day expiry
  - path /
  - IP address and user agent validation for enhanced security
- Session verification parses cookie, validates expiry, IP address, and user agent, and clears compromised sessions
- Logout destroys the session cookie

**Updated** Enhanced with comprehensive IP address and user agent validation for session security monitoring

Implementation highlights:
- Token generation: [auth.ts:21-23](file://src/lib/auth.ts#L21-L23)
- Cookie creation with IP/user-agent: [auth.ts:26-50](file://src/lib/auth.ts#L26-L50)
- Enhanced session verification with validation: [auth.ts:52-89](file://src/lib/auth.ts#L52-L89)
- Session destruction: [auth.ts:92-95](file://src/lib/auth.ts#L92-L95)
- Logout endpoint: [logout/route.ts:1-13](file://src/app/api/auth/logout/route.ts#L1-L13)

```mermaid
flowchart TD
Start(["Enhanced Session Creation"]) --> GenToken["Generate Random Token"]
GenToken --> BuildCookie["Build Cookie Payload<br/>{ adminId, token, ip, userAgent, expiresAt }"]
BuildCookie --> SetCookie["Set Secure Cookie<br/>httpOnly + secure + sameSite + expiry"]
SetCookie --> ReturnToken["Return Token to caller"]
VerifyStart(["Enhanced Session Verification"]) --> ReadCookie["Read Cookie Value"]
ReadCookie --> ParseJSON["Parse JSON Payload"]
ParseJSON --> CheckExpiry{"Expired?"}
CheckExpiry --> |Yes| Destroy["Destroy Session Cookie"]
Destroy --> NullReturn["Return null"]
CheckExpiry --> |No| ExtractHeaders["Extract IP and User-Agent from Headers"]
ExtractHeaders --> ValidateIP{"IP Match?<br/>session.ip === currentIp"}
ValidateIP --> |No| LogWarning["Log Security Warning"]
LogWarning --> Destroy2["Destroy Session Cookie"]
Destroy2 --> NullReturn
ValidateIP --> |Yes| ValidateUA{"User-Agent Match?<br/>session.userAgent === currentUserAgent"}
ValidateUA --> |No| LogWarning2["Log Security Warning"]
LogWarning2 --> Destroy3["Destroy Session Cookie"]
Destroy3 --> NullReturn
ValidateUA --> |Yes| ReturnAdmin["Return adminId"]
```

**Diagram sources**
- [auth.ts:21-23](file://src/lib/auth.ts#L21-L23)
- [auth.ts:26-50](file://src/lib/auth.ts#L26-L50)
- [auth.ts:52-89](file://src/lib/auth.ts#L52-L89)
- [auth.ts:92-95](file://src/lib/auth.ts#L92-L95)

**Section sources**
- [auth.ts:21-23](file://src/lib/auth.ts#L21-L23)
- [auth.ts:26-50](file://src/lib/auth.ts#L26-L50)
- [auth.ts:52-89](file://src/lib/auth.ts#L52-L89)
- [auth.ts:92-95](file://src/lib/auth.ts#L92-L95)
- [logout/route.ts:1-13](file://src/app/api/auth/logout/route.ts#L1-L13)

### User Registration Flow
- Setup endpoint checks admin existence and capacity before creation
- Password strength validated (minimum 8 characters)
- New admin created with bcrypt-hashed password
- Returns success with admin identifier

Implementation highlights:
- Setup check: [setup/route.ts:4-21](file://src/app/api/auth/setup/route.ts#L4-L21)
- Setup creation: [setup/route.ts:23-62](file://src/app/api/auth/setup/route.ts#L23-L62)
- Admin creation utility: [auth.ts:143-155](file://src/lib/auth.ts#L143-L155)

```mermaid
sequenceDiagram
participant Client as "Client"
participant Setup as "Setup Route"
participant Auth as "Auth Utilities"
participant DB as "Database"
Client->>Setup : GET /api/auth/setup
Setup->>Auth : adminExists(), countAdmins(), getMaxAccounts(), canCreateAdmin()
Auth->>DB : queries
DB-->>Auth : counts and flags
Auth-->>Setup : { exists, count, maxAccounts, canCreate }
Setup-->>Client : JSON status
Client->>Setup : POST /api/auth/setup
Setup->>Auth : canCreateAdmin()
Auth-->>Setup : boolean
Setup->>Auth : createAdmin(email, password, name)
Auth->>DB : create admin with hashed password
DB-->>Auth : admin record
Auth-->>Setup : { id, email }
Setup-->>Client : JSON { success, admin }
```

**Diagram sources**
- [setup/route.ts:4-21](file://src/app/api/auth/setup/route.ts#L4-L21)
- [setup/route.ts:23-62](file://src/app/api/auth/setup/route.ts#L23-L62)
- [auth.ts:143-155](file://src/lib/auth.ts#L143-L155)

**Section sources**
- [setup/route.ts:4-21](file://src/app/api/auth/setup/route.ts#L4-L21)
- [setup/route.ts:23-62](file://src/app/api/auth/setup/route.ts#L23-L62)
- [auth.ts:143-155](file://src/lib/auth.ts#L143-L155)

### Login Endpoint
- Validates presence and format of email
- Implements memory-based rate limiting (max 5 attempts per IP, 15-minute lockout)
- Extracts client IP from HTTP headers with fallback mechanisms (x-real-ip, x-forwarded-for)
- On successful authentication, creates a session with IP and user agent validation and returns admin info
- On failure, increments attempts and adds a small randomized delay to mitigate timing attacks

**Updated** Enhanced with comprehensive IP address extraction and validation for session security

Implementation highlights:
- Rate limiting structure: [login/route.ts:4-7](file://src/app/api/auth/login/route.ts#L4-L7)
- IP extraction from headers: [login/route.ts:11-14](file://src/app/api/auth/login/route.ts#L11-L14)
- Attempt tracking and lockout: [login/route.ts:16-33](file://src/app/api/auth/login/route.ts#L16-L33)
- Credential validation and delay: [login/route.ts:52-74](file://src/app/api/auth/login/route.ts#L52-L74)
- Session creation with IP parameter: [login/route.ts:80](file://src/app/api/auth/login/route.ts#L80)

```mermaid
flowchart TD
Enter(["POST /api/auth/login"]) --> GetIP["Extract Client IP<br/>x-real-ip or x-forwarded-for"]
GetIP --> CheckRate["Check Attempts Map"]
CheckRate --> Locked{"Max Attempts Reached<br/>and Within Lockout?"}
Locked --> |Yes| RespondLocked["429 Too Many Requests"]
Locked --> |No| ParseBody["Parse JSON Body"]
ParseBody --> ValidateEmail{"Email Present and Valid?"}
ValidateEmail --> |No| RespondBadReq["400 Bad Request"]
ValidateEmail --> |Yes| Authenticate["authenticateAdmin(email, password)"]
Authenticate --> Found{"Admin Found?"}
Found --> |No| Increment["Increment Attempts Map"] --> Delay["Randomized Delay"] --> RespondUnauthorized["401 Unauthorized"]
Found --> |Yes| ClearAttempts["Clear Attempts Map"] --> CreateSession["createSession(adminId, ip)"]
CreateSession --> RespondSuccess["200 OK with admin info"]
```

**Diagram sources**
- [login/route.ts:4-7](file://src/app/api/auth/login/route.ts#L4-L7)
- [login/route.ts:11-14](file://src/app/api/auth/login/route.ts#L11-L14)
- [login/route.ts:16-33](file://src/app/api/auth/login/route.ts#L16-L33)
- [login/route.ts:52-74](file://src/app/api/auth/login/route.ts#L52-L74)
- [login/route.ts:80](file://src/app/api/auth/login/route.ts#L80)

**Section sources**
- [login/route.ts:4-7](file://src/app/api/auth/login/route.ts#L4-L7)
- [login/route.ts:11-14](file://src/app/api/auth/login/route.ts#L11-L14)
- [login/route.ts:16-33](file://src/app/api/auth/login/route.ts#L16-L33)
- [login/route.ts:52-74](file://src/app/api/auth/login/route.ts#L52-L74)
- [login/route.ts:80](file://src/app/api/auth/login/route.ts#L80)

### Logout Endpoint
- Destroys the session cookie immediately
- Returns success regardless of prior session state

Implementation highlights:
- Logout handler: [logout/route.ts:1-13](file://src/app/api/auth/logout/route.ts#L1-L13)
- Session destruction: [auth.ts:92-95](file://src/lib/auth.ts#L92-L95)

**Section sources**
- [logout/route.ts:1-13](file://src/app/api/auth/logout/route.ts#L1-L13)
- [auth.ts:92-95](file://src/lib/auth.ts#L92-L95)

### Authentication State Check
- Retrieves current admin by parsing session cookie and querying the database
- Returns authenticated status and admin info if session valid with enhanced security validation

**Updated** Enhanced with comprehensive IP and user agent validation during session verification

Implementation highlights:
- Check handler: [check/route.ts:1-21](file://src/app/api/auth/check/route.ts#L1-L21)
- Current admin retrieval: [auth.ts:167-174](file://src/lib/auth.ts#L167-L174)

**Section sources**
- [check/route.ts:1-21](file://src/app/api/auth/check/route.ts#L1-L21)
- [auth.ts:167-174](file://src/lib/auth.ts#L167-L174)

### Password Reset Functionality
- Initiation:
  - Validates email format
  - Checks for recent tokens to prevent spam
  - Invalidates unused previous tokens
  - Generates a plain token for email and stores a hashed token
  - Sends email via Resend with a 1-hour expiry link
- Validation:
  - Verifies token hash against database
  - Ensures token is not used and not expired
- Reset:
  - Validates password strength
  - Hashes new password with 12 rounds
  - Updates admin password and marks token as used

Implementation highlights:
- Token generation and storage: [reset-password/route.ts:10-167](file://src/app/api/auth/reset-password/route.ts#L10-L167)
- Token validation: [reset-password/route.ts:188-213](file://src/app/api/auth/reset-password/route.ts#L188-L213)
- Password reset: [reset-password/route.ts:216-261](file://src/app/api/auth/reset-password/route.ts#L216-L261)
- Frontend initiation: [recuperar-clave/page.tsx:25-43](file://src/app/portal-interno/recuperar-clave/page.tsx#L25-L43)
- Frontend validation and reset: [restablecer/page.tsx:36-90](file://src/app/portal-interno/restablecer/page.tsx#L36-L90)

```mermaid
sequenceDiagram
participant Client as "Client Browser"
participant Reset as "Reset Password Route"
participant DB as "Database"
participant Email as "Resend API"
Client->>Reset : POST /api/auth/reset-password { email }
Reset->>Reset : Validate email format
Reset->>DB : findUnique({ email }) lowercased
DB-->>Reset : Admin or null
Reset->>DB : findFirst recent token (5 min)
DB-->>Reset : token or null
Reset->>DB : updateMany old tokens to used
Reset->>DB : create token with hashed token and 1h expiry
Reset->>Email : sendResetEmail(token)
Reset-->>Client : JSON { success }
Client->>Reset : GET /api/auth/reset-password?token=...
Reset->>DB : findUnique({ token : sha256(token) })
DB-->>Reset : token or null
Reset-->>Client : JSON { valid, email }
Client->>Reset : PUT /api/auth/reset-password { token, password }
Reset->>Reset : Validate password length
Reset->>DB : findUnique({ token : sha256(token) })
DB-->>Reset : token or null
Reset->>DB : update admin.password = bcrypt.hash(password, 12)
Reset->>DB : update token.used = true
Reset-->>Client : JSON { success }
```

**Diagram sources**
- [reset-password/route.ts:10-167](file://src/app/api/auth/reset-password/route.ts#L10-L167)
- [reset-password/route.ts:188-213](file://src/app/api/auth/reset-password/route.ts#L188-L213)
- [reset-password/route.ts:216-261](file://src/app/api/auth/reset-password/route.ts#L216-L261)
- [recuperar-clave/page.tsx:25-43](file://src/app/portal-interno/recuperar-clave/page.tsx#L25-L43)
- [restablecer/page.tsx:36-90](file://src/app/portal-interno/restablecer/page.tsx#L36-L90)

**Section sources**
- [reset-password/route.ts:10-167](file://src/app/api/auth/reset-password/route.ts#L10-L167)
- [reset-password/route.ts:188-213](file://src/app/api/auth/reset-password/route.ts#L188-L213)
- [reset-password/route.ts:216-261](file://src/app/api/auth/reset-password/route.ts#L216-L261)
- [recuperar-clave/page.tsx:25-43](file://src/app/portal-interno/recuperar-clave/page.tsx#L25-L43)
- [restablecer/page.tsx:36-90](file://src/app/portal-interno/restablecer/page.tsx#L36-L90)

### Account Deletion
- Requires authenticated admin context
- Prevents deletion of the last admin
- Deletes admin record and destroys session

Implementation highlights:
- Deletion handler: [delete-account/route.ts:1-43](file://src/app/api/auth/delete-account/route.ts#L1-L43)
- Admin count and deletion: [auth.ts:124-140](file://src/lib/auth.ts#L124-L140)

**Section sources**
- [delete-account/route.ts:1-43](file://src/app/api/auth/delete-account/route.ts#L1-L43)
- [auth.ts:124-140](file://src/lib/auth.ts#L124-L140)

### Database Models and Schema
- Admin model: unique email, password hash, role, status, timestamps
- PasswordResetToken model: unique token hash, email, expiry (1 hour), used flag, timestamps

Implementation highlights:
- Admin model: [schema.prisma:201-211](file://prisma/schema.prisma#L201-L211)
- PasswordResetToken model: [schema.prisma:214-222](file://prisma/schema.prisma#L214-L222)

**Section sources**
- [schema.prisma:201-211](file://prisma/schema.prisma#L201-L211)
- [schema.prisma:214-222](file://prisma/schema.prisma#L214-L222)

## Dependency Analysis
The authentication system relies on bcrypt for password hashing, secure cookie management via Next.js headers, and Prisma for database operations. The frontend pages integrate with API endpoints to complete authentication workflows.

```mermaid
graph LR
Pkg["package.json<br/>dependencies"] --> Bcrypt["bcryptjs"]
Pkg --> Resend["resend"]
Pkg --> Prisma["@prisma/client"]
Pkg --> LibSQL["@libsql/client"]
Auth["src/lib/auth.ts"] --> Bcrypt
Auth --> DB["src/lib/db.ts"]
Login["/api/auth/login/route.ts"] --> Auth
Logout["/api/auth/logout/route.ts"] --> Auth
Check["/api/auth/check/route.ts"] --> Auth
Reset["/api/auth/reset-password/route.ts"] --> Resend
Reset --> DB
Setup["/api/auth/setup/route.ts"] --> Auth
DeleteAcc["/api/auth/delete-account/route.ts"] --> Auth
DB --> Prisma
DB --> LibSQL
```

**Diagram sources**
- [package.json:68-92](file://package.json#L68-L92)
- [auth.ts:1-4](file://src/lib/auth.ts#L1-L4)
- [db.ts:1-8](file://src/lib/db.ts#L1-L8)
- [login/route.ts:1-2](file://src/app/api/auth/login/route.ts#L1-L2)
- [reset-password/route.ts:1-4](file://src/app/api/auth/reset-password/route.ts#L1-L4)

**Section sources**
- [package.json:68-92](file://package.json#L68-L92)
- [auth.ts:1-4](file://src/lib/auth.ts#L1-L4)
- [db.ts:1-8](file://src/lib/db.ts#L1-L8)
- [login/route.ts:1-2](file://src/app/api/auth/login/route.ts#L1-L2)
- [reset-password/route.ts:1-4](file://src/app/api/auth/reset-password/route.ts#L1-L4)

## Performance Considerations
- bcrypt cost factor 12 balances security and performance; adjust based on hardware capabilities
- Rate limiting uses an in-memory Map; consider Redis for distributed environments
- Session cookie size is minimal; avoid storing large payloads
- Database queries are lightweight; ensure proper indexing on unique fields (email, token)
- Enhanced IP and user agent validation adds minimal overhead but provides significant security benefits

## Security Measures
- Brute force protection:
  - Max 5 attempts per IP with 15-minute lockout
  - Randomized delay on invalid credentials
- Enhanced session security:
  - httpOnly, secure, sameSite strict, 7-day expiry
  - Automatic expiry validation and cleanup
  - IP address validation against session creation IP
  - User agent validation to detect browser changes
  - Real-time security warnings for suspicious activity
- Password handling:
  - bcrypt with 12 rounds
  - Tokens stored as hashes; plain tokens only used in emails
- Transport security:
  - HSTS header enforced
  - Secure cookies in production
- Input validation:
  - Email format validation
  - Password length validation
- IP address extraction:
  - Fallback mechanisms: x-real-ip, x-forwarded-for, unknown
  - Vercel infrastructure injection for reliable IP detection

**Updated** Enhanced with comprehensive IP and user agent validation for session security monitoring

Evidence in code:
- Rate limiting and delays: [login/route.ts:4-7](file://src/app/api/auth/login/route.ts#L4-L7), [login/route.ts:67-68](file://src/app/api/auth/login/route.ts#L67-L68)
- Enhanced cookie attributes: [auth.ts:41-47](file://src/lib/auth.ts#L41-L47)
- Expiry handling: [auth.ts:28](file://src/lib/auth.ts#L28), [auth.ts:63-66](file://src/lib/auth.ts#L63-L66)
- Enhanced session validation: [auth.ts:73-83](file://src/lib/auth.ts#L73-L83)
- bcrypt rounds: [auth.ts:12](file://src/lib/auth.ts#L12), [reset-password/route.ts:242](file://src/app/api/auth/reset-password/route.ts#L242)
- Token hashing: [reset-password/route.ts:157](file://src/app/api/auth/reset-password/route.ts#L157)
- Security headers: [middleware.ts:8-41](file://src/middleware.ts#L8-L41)
- IP extraction: [login/route.ts:11-14](file://src/app/api/auth/login/route.ts#L11-L14)

**Section sources**
- [login/route.ts:4-7](file://src/app/api/auth/login/route.ts#L4-L7)
- [login/route.ts:67-68](file://src/app/api/auth/login/route.ts#L67-L68)
- [auth.ts:41-47](file://src/lib/auth.ts#L41-L47)
- [auth.ts:28](file://src/lib/auth.ts#L28)
- [auth.ts:63-66](file://src/lib/auth.ts#L63-L66)
- [auth.ts:73-83](file://src/lib/auth.ts#L73-L83)
- [auth.ts:12](file://src/lib/auth.ts#L12)
- [reset-password/route.ts:242](file://src/app/api/auth/reset-password/route.ts#L242)
- [reset-password/route.ts:157](file://src/app/api/auth/reset-password/route.ts#L157)
- [middleware.ts:8-41](file://src/middleware.ts#L8-L41)
- [login/route.ts:11-14](file://src/app/api/auth/login/route.ts#L11-L14)

## Troubleshooting Guide
- Login failures:
  - Verify email format and presence
  - Check rate limit lockout messages
  - Confirm bcrypt rounds and password correctness
  - Verify IP extraction from headers (x-real-ip, x-forwarded-for)
- Enhanced session issues:
  - Ensure secure cookie attributes match environment (secure flag in production)
  - Validate cookie expiry and automatic cleanup
  - Check IP address validation logs for security warnings
  - Monitor user agent changes that may trigger session invalidation
- Password reset problems:
  - Confirm Resend API key and sender configuration
  - Check token validity and expiry
  - Verify database connectivity and Prisma client initialization
- Admin limits:
  - Confirm MAX_ADMIN_ACCOUNTS environment variable
  - Ensure admin count reflects actual records

**Updated** Enhanced troubleshooting guidance for IP and user agent validation issues

Common references:
- Login error handling: [login/route.ts:38-50](file://src/app/api/auth/login/route.ts#L38-L50), [login/route.ts:67-74](file://src/app/api/auth/login/route.ts#L67-L74)
- Enhanced session verification errors: [auth.ts:73-83](file://src/lib/auth.ts#L73-L83)
- Reset endpoint errors: [reset-password/route.ts:110-118](file://src/app/api/auth/reset-password/route.ts#L110-L118), [reset-password/route.ts:193-206](file://src/app/api/auth/reset-password/route.ts#L193-L206)
- Setup limits: [setup/route.ts:29-33](file://src/app/api/auth/setup/route.ts#L29-L33)
- Database client: [db.ts:14-21](file://src/lib/db.ts#L14-L21)

**Section sources**
- [login/route.ts:38-50](file://src/app/api/auth/login/route.ts#L38-L50)
- [login/route.ts:67-74](file://src/app/api/auth/login/route.ts#L67-L74)
- [auth.ts:73-83](file://src/lib/auth.ts#L73-L83)
- [reset-password/route.ts:110-118](file://src/app/api/auth/reset-password/route.ts#L110-L118)
- [reset-password/route.ts:193-206](file://src/app/api/auth/reset-password/route.ts#L193-L206)
- [setup/route.ts:29-33](file://src/app/api/auth/setup/route.ts#L29-L33)
- [db.ts:14-21](file://src/lib/db.ts#L14-L21)

## Conclusion
GreenAxis implements a robust authentication system featuring bcrypt password hashing with 12 rounds, secure session management with hardened cookie attributes, comprehensive rate limiting, and a complete password reset workflow with token hashing and expiry. The system has been significantly enhanced with IP address verification and user agent validation for session management, providing strong protection against session hijacking and unauthorized access attempts. The modular design separates concerns across utilities, API routes, and database models, while middleware ensures transport and content security. The frontend pages integrate seamlessly with the backend to deliver a secure and user-friendly authentication experience with enhanced security monitoring capabilities.