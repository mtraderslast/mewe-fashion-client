import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    plugins: [
        inferAdditionalFields({
            user: {
                role: {
                    type: "string",
                    input: false,
                },
                phone: {
                    type: "string",
                },
                address: {
                    type: "string",
                },
            },
        }),
    ],
});

export const { signIn, signUp, useSession, signOut } = authClient;
