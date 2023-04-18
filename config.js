const exchange = process.env.RABBITMQ_EXCHANGE;
const dlx_exchange = process.env.RABBITMQ_DLX_EXCHANGE;
const dlx_queue = process.env.RABBITMQ_DLX_QUEUE;

module.exports = {
  rest: {
    port: +(process.env.PORT || 3000),
    host: process.env.HOST,
    // The `gracePeriodForClose` provides a graceful close for http/https
    // servers with keep-alive clients. The default value is `Infinity`
    // (don't force-close). If you want to immediately destroy all sockets
    // upon stop, set its value to `0`.
    // See https://www.npmjs.com/package/stoppable
    gracePeriodForClose: 5000, // 5 seconds
    openApiSpec: {
      // useful when used with OpenAPI-to-GraphQL to locate your application
      setServersFromRequest: true,
    },
  },
  rabbitmq: {
    uri: process.env.RABBITMQ_URI,
    defaultHandlerError: parseInt(process.env.RABBITMQ_HANDLER_ERROR),
    exchanges: [
      {name: dlx_exchange, type: 'topic'},
      {
        name: exchange,
        type: 'x-delayed-message',
        options: {
          arguments: {'x-delayed-type': 'topic'},
        },
      },
    ],
    queues: [
      {
        name: dlx_queue,
        options: {
          deadLetterExchange: exchange,
          messageTtl: 20000,
        },
        exchange: {
          name: dlx_exchange,
          routingKey: 'model.*.*',
        },
      },
    ],
  },
};
