# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Clerk + Convex Integration

This project is integrated with **Clerk** for authentication and **Convex** for the database. They are connected so that authenticated users can securely access their data.

### ✅ What's Already Set Up

1. **Clerk Provider** - Configured in `app/_layout.tsx`
2. **Convex Provider with Clerk** - Using `ConvexProviderWithClerk` to pass authentication tokens
3. **Convex Auth Configuration** - `convex/auth.config.ts` is set up to validate Clerk JWT tokens
4. **Authenticated Functions** - Convex functions in `convex/tasks.ts` use authentication:
   - `get` - Returns tasks for the authenticated user
   - `create` - Creates a new task (requires auth)
   - `update` - Updates a task (requires auth + ownership)
   - `remove` - Deletes a task (requires auth + ownership)
5. **Helper Functions** - `convex/helpers.ts` provides `getCurrentUser()` and `requireAuth()`

### 🔧 Required Configuration

To complete the integration, you need to:

#### 1. Set up Clerk JWT Template

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Session Management → JWT Templates**
3. Create a new JWT template:
   - Name: `convex` (must be exactly this name)
   - Select the **Convex** template
   - Copy the **Issuer URL** (you'll need this for step 2)

#### 2. Configure Environment Variables

Create a `.env` file in the project root (or add to your existing one):

```env
# Clerk Configuration
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... # Your Clerk publishable key

# Convex Configuration
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Convex Auth Configuration (for backend)
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain.clerk.accounts.dev
```

**Important**: The `CLERK_JWT_ISSUER_DOMAIN` is used by the Convex backend. You can set this in:
- Your Convex dashboard under **Settings → Environment Variables**
- Or locally when running `npx convex dev` (it will prompt you)

#### 3. Deploy Convex Auth Config

After setting up the environment variables, deploy your Convex functions:

```bash
npx convex dev
```

This will:
- Deploy the `auth.config.ts` file
- Sync your Convex functions
- Validate the Clerk integration

### 📝 How It Works

1. **User Authentication**: Users sign in via Clerk (handled in `app/(auth)/sign-in.tsx` and `app/(auth)/sign-up.tsx`)
2. **Token Passing**: `ConvexProviderWithClerk` automatically fetches JWT tokens from Clerk and passes them to Convex
3. **Backend Validation**: Convex validates the JWT token using the issuer domain configured in `auth.config.ts`
4. **User Identity**: In Convex functions, use `ctx.auth.getUserIdentity()` to get the authenticated user's information
5. **Data Isolation**: Tasks are filtered by `userId` to ensure users only see their own data

### 🔍 Testing the Integration

1. Start your app: `npm start`
2. Sign up/Sign in through the auth screens
3. The home screen should show your tasks (empty initially)
4. You can create tasks using the `api.tasks.create` mutation

### 📚 Additional Resources

- [Clerk + Convex Integration Guide](https://clerk.com/docs/integrations/databases/convex)
- [Convex Authentication Docs](https://docs.convex.dev/auth)
- [Convex + Clerk Stack Overflow](https://stack.convex.dev/user-authentication-with-clerk-and-convex)

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
