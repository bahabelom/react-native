// Example Convex function file
// This file ensures TypeScript has files to compile

import { query } from "./_generated/server";

export const example = query({
  handler: async () => {
    return "Hello from Convex!";
  },
});
