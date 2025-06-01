import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    view: v.optional(v.string()),
    dateQuery: v.optional(v.string()),
    results: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("This TypeScript function is running on the server.");
    await ctx.db.insert("nbweatherproject", {
      dateQuery: args.dateQuery,
      results: args.results,
    });

    // Add the following lines:
    if (args.view?.startsWith("/table")) {
      // We'll get there..
      console.log("/table will toggle view to table");
    }

    if (args.view?.startsWith("/compare")) {
      // We'll get there..
      console.log("/compare will toggle view to comparison");
    }
  },
});

// Add the following function to the file:
export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    // Get most recent messages first
    const messages = await ctx.db.query("messages").order("desc").take(50);
    // Reverse the list so that it's in a chronological order.
    return messages.reverse();
  },
});
