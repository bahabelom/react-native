import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, getCurrentUser } from "./helpers";

// Get all tasks for the authenticated user
export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await getCurrentUser(ctx);
    
    // If not authenticated, return empty array
    if (!identity) {
      return [];
    }

    // Filter tasks by the authenticated user's ID
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();
  },
});

// Create a new task (requires authentication)
export const create = mutation({
  args: {
    text: v.string(),
    isCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: args.isCompleted ?? false,
      userId: identity.subject,
      createdAt: Date.now(),
    });

    return await ctx.db.get(taskId);
  },
});

// Update an existing task (requires authentication and ownership)
export const update = mutation({
  args: {
    id: v.id("tasks"),
    text: v.optional(v.string()),
    isCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    // Verify the task exists and belongs to the user
    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.userId !== identity.subject) {
      throw new Error("Unauthorized: You can only update your own tasks");
    }

    // Update the task
    const updates: { text?: string; isCompleted?: boolean } = {};
    if (args.text !== undefined) {
      updates.text = args.text;
    }
    if (args.isCompleted !== undefined) {
      updates.isCompleted = args.isCompleted;
    }

    await ctx.db.patch(args.id, updates);
    return await ctx.db.get(args.id);
  },
});

// Delete a task (requires authentication and ownership)
export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    // Verify the task exists and belongs to the user
    const task = await ctx.db.get(args.id);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.userId !== identity.subject) {
      throw new Error("Unauthorized: You can only delete your own tasks");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
