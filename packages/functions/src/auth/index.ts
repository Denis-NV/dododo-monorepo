import { handle } from "hono/aws-lambda";
import { issuer } from "@openauthjs/openauth";
import { PasswordProvider } from "@openauthjs/openauth/provider/password";
import { PasswordUI } from "@openauthjs/openauth/ui/password";
import { subjects } from "./subjects";

async function getUser(email: string) {
  // Get user from database and return user ID
  // lookup user or create them
  return "123";
}

const app = issuer({
  subjects,
  // Remove after setting custom domain
  allow: async () => true,
  providers: {
    password: PasswordProvider(
      PasswordUI({
        copy: {
          error_email_taken: "This email is already taken.",
        },
        sendCode: async (email, code) => {
          console.log(email, code);
        },
      })
    ),
  },
  success: async (ctx, value) => {
    if (value.provider === "password") {
      return ctx.subject("user", {
        userID: await getUser(value.email),
      });
    }
    throw new Error("Invalid provider");
  },
});

export const handler = handle(app);
