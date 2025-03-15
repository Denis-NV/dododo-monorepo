import { APIGatewayProxyEvent, Context, Handler } from "aws-lambda";
import express from "express";
import serverless from "serverless-http";

import assesments from "./resources/assessments/routes";

const app = express();

app.use(express.json());

// routes
app.use(assesments);

const handleRequest = serverless(app);

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  return await handleRequest(event, context);
};
