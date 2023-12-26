const handler = async (event: unknown): Promise<unknown> => {
  const test = 12;

  const response = {
    statusCode: 200,

    body: JSON.stringify({
      message: 'Hello World!',
      input: event,
    }),
  };
  return response;
};

export default handler;
