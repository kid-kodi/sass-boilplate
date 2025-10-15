import { lastLoginMethodClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { stripeClient } from "@better-auth/stripe/client"

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    plugins: [
        organizationClient(),
        stripeClient({
            subscription: true //if you want to enable subscription management
        }),
        lastLoginMethodClient()
    ]
});