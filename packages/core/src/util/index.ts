import { Context, APIGatewayProxyEvent } from "aws-lambda";

type TLambda = (evt: APIGatewayProxyEvent, context: Context) => Promise<string>;

export const handler =
  (lambda: TLambda) =>
  async (event: APIGatewayProxyEvent, context: Context) => {
    let body: string, statusCode: number;

    try {
      // Run the Lambda
      body = await lambda(event, context);
      statusCode = 200;
    } catch (error) {
      statusCode = 500;
      body = JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Return HTTP response
    return {
      body,
      statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  };
