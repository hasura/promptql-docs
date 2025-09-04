# PromptQL Docs Authentication Setup

This directory contains the mock authentication setup for the PromptQL documentation site using Hydra OAuth2 server.

## Quick Start

1. **Start the development environment:**
   ```bash
   yarn start
   ```

2. **Test the authentication flow:**
   - Visit http://localhost:3001
   - Try to access any documentation page (e.g., http://localhost:3001/docs/quickstart/)
   - You should be redirected to the login page
   - Click "Sign In with Hasura Cloud" to start the OAuth flow

3. **Test production build locally:**
   ```bash
   yarn build:local
   ```

## Architecture Overview

### Components

1. **Hydra OAuth2 Server** (Port 4444/4445)
   - Handles OAuth2 authorization flow
   - Admin API on port 4445, Public API on port 4444

2. **Login/Consent App** (Port 3000)
   - Mock login interface that simulates Hasura Cloud login
   - Handles user consent for OAuth2 flow

3. **Docusaurus App** (Port 3001)
   - Main documentation site with integrated authentication

### Authentication Flow

1. User visits protected documentation page
2. `Root.tsx` provides AuthContext to entire app
3. `Layout.tsx` component checks authentication status
4. If not authenticated, `ProtectedRoute.tsx` shows login prompt
5. User clicks login → redirected to Hydra OAuth2 endpoint
6. Hydra redirects to mock login app (port 3000)
7. User "logs in" → redirected back to Hydra
8. Hydra redirects to `/docs/callback` with authorization code
9. `AuthContext.tsx` exchanges code for access token (with duplicate call protection)
10. User info is fetched and stored in cookies
11. User is redirected to original destination

### Key Files

- `src/contexts/AuthContext.tsx` - Main authentication logic with OAuth2 flow
- `src/theme/Root.tsx` - Provides AuthContext to entire app
- `src/theme/Layout/index.tsx` - Route protection logic and loading states
- `src/components/ProtectedRoute.tsx` - Protected route wrapper with delayed loading
- `src/pages/login.tsx` - Login page with brand styling
- `src/pages/callback.tsx` - OAuth callback handler with duplicate call protection
- `src/theme/Navbar/Content/index.tsx` - Navbar with conditional auth elements
- `src/css/custom.css` - Authentication styles with brand colors and animations

## Configuration

### OAuth2 Settings
- **Client ID:** `docusaurus-client`
- **Redirect URI:** `http://localhost:3001/docs/callback`
- **Scopes:** `openid email`

### Public Routes
The following routes are accessible without authentication:
- `/` (landing page)
- `/docs/` (docs landing page)
- `/login` (login page)
- `/docs/callback` (OAuth callback)

All other routes require authentication.

## Key Features

### UI/UX Enhancements
- **Brand Colors**: Uses PromptQL brand colors that adapt to light/dark themes
- **Delayed Loading**: Loading animations only appear after 5 seconds to avoid visual noise
- **Animated Dots**: Professional 3-dot loading animation using CSS keyframes
- **Conditional Navbar**: Search and navigation elements hidden when unauthenticated
- **Responsive Design**: Works across all device sizes

### Technical Features
- **Duplicate Call Protection**: Prevents React Strict Mode from causing "code already used" errors
- **CORS Support**: Proper CORS configuration for browser-to-Hydra communication
- **Session Persistence**: Authentication state persists across browser refreshes
- **Error Handling**: Comprehensive error states with user-friendly messages
- **Clean Architecture**: Centralized auth logic with proper separation of concerns

## Development vs Production

### Development (Current Setup)
- Mock Hydra server with in-memory storage and CORS enabled
- Mock login/consent interface configured as public client (no client secret)
- User access check always returns `true`
- Access tokens stored in browser cookies (`hasura-lux`) with 1-day expiration
- Tokens are retrieved from cookies and sent as Authorization Bearer headers to GraphQL API
- Delayed loading animations (5-second threshold)
- Brand-consistent styling across light/dark themes

### Production (Future)
- Real Hydra endpoints: `https://oauth.pro.hasura.io/*`
- Real Hasura Cloud login interface configured as public client
- GraphQL API check against `ddn_promptql_enabled_users` table
- Secure httpOnly cookies for token storage
- Tokens sent as Authorization Bearer headers to GraphQL API
- Proper error handling and security headers

## Troubleshooting

### Services won't start
```bash
# Check if ports are in use
lsof -i :3000 -i :4444 -i :4445

# Stop existing containers
docker compose -f auth/compose.yml down

# Restart services
./auth/start-auth-dev.sh
```

### Authentication fails
```bash
# Check service logs
docker compose -f auth/compose.yml logs -f

# Verify client registration
curl http://localhost:4445/admin/clients/docusaurus-client
```

### Clear authentication state
```bash
# In browser console:
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
```

## Testing Checklist

- [ ] Unauthenticated users can access landing pages (`/` and `/docs/`)
- [ ] Unauthenticated users redirected to login for protected pages
- [ ] Login flow redirects to Hydra auth endpoint
- [ ] Mock login interface appears and works correctly
- [ ] Successful auth redirects to `/docs/callback` then to original destination
- [ ] User email appears in navbar after authentication
- [ ] Logout clears session and redirects to `/docs/index/`
- [ ] Auth state persists across browser refresh
- [ ] Loading animations only appear after 5-second delay
- [ ] Search bar and navigation hidden when unauthenticated
- [ ] Error handling works for failed auth attempts
- [ ] No "authorization code already used" errors (duplicate call protection)

## Commands

```bash
# Start development environment
yarn start

# Stop development services
yarn dev:stop

# Test production build locally
yarn build:local

# Manual service management (if needed)
docker compose -f auth/compose.yml logs -f    # View logs
docker compose -f auth/compose.yml down       # Stop services
docker compose -f auth/compose.yml restart hydra  # Restart Hydra

# Check client configuration
curl http://localhost:4445/admin/clients/docusaurus-client
```
