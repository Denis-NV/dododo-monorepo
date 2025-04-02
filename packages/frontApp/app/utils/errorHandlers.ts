import { z } from "zod";

export type TErrorResponse = {
  nonFieldError?: string;
  fieldErrors?: Record<string, string>;
  errorCode?: string;
  status: number;
};

export const sendErrorResponse = (error: any): TErrorResponse => {
  if (error instanceof z.ZodError) {
    return Response.json(error.formErrors, { status: 400 });
  }

  if (error.name === "Unauthorized") {
    return Response.json(
      { nonFieldError: error.message || "You are not authorized." },
      { status: 400 }
    );
  }

  return Response.json(
    {
      nonFieldError: error.message || "something went wrong",
      ...(error.cause?.errorCode && { errorCode: error.cause?.errorCode }),
    },
    { status: error.cause?.statusCode || 500 }
  );
};

export const sendErrorMessage = (message: string, status: number) => {
  return Response.json({ nonFieldError: message }, { status });
};
