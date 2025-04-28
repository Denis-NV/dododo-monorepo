import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";

const verifyEmailInput = z.object({
  code: z.coerce.string(),
});

const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  const result = verifyEmailInput.safeParse(payload);

  if (!result.success) {
    const error = result.error.flatten();

    return {
      formErrors: error.formErrors,
      fieldErrors: error.fieldErrors,
    };
  }

  return null;
};

export default action;
