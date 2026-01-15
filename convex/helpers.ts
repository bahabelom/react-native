import { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Gets the current user identity from the Convex context.
 * Returns null if the user is not authenticated.
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  return identity;
}

/**
 * Gets the current user identity and throws an error if not authenticated.
 * Use this in functions that require authentication.
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: User must be authenticated");
  }
  return identity;
}
