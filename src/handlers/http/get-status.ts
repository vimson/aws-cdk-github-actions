import { APIGatewayEvent } from 'aws-lambda';

export async function handler(event: APIGatewayEvent) {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Get status response - Hello World!',
      input: event,
    }),
  };
  return response;
}
