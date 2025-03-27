import { APIGatewayProxyEvent, Context, Handler } from "aws-lambda";
import express, { Request, Response, NextFunction } from "express";
import serverless from "serverless-http";

import assessments from "./resources/assessments/routes";
import users from "./resources/users/routes";

const app = express();

app.use(express.json());

// routes
app.use(assessments);
app.use(users);

// middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

const handleRequest = serverless(app);

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  return await handleRequest(event, context);
};
