import { lastLoginMethodClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { stripeClient } from "@better-auth/stripe/client"
import { admin, member, owner, super_admin } from "./auth/permissions";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    plugins: [
        organizationClient({
            roles: {
                owner,
                admin,
                member,
                super_admin
            }
        }),
        stripeClient({
            subscription: true //if you want to enable subscription management
        }),
        lastLoginMethodClient()
    ]
});