import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

export const authClient = createAuthClient({
  fetchOptions: {
    onError: async ({ response }) => {
      if (response.status === 429) {
        toast.warning("You are being rate limited!");
      }
    },
  },
});
