const AWS = require("aws-sdk");

module.exports.orderCallback = async (event) => {
  if (process.env.ENVIRONMENT === "local") {
    AWS.config.update({
      region: process.env.REGION,
      endpoint: "http://host.docker.internal:4566",
    });
  }

  const sqs = new AWS.SQS();

  try {
    const body = JSON.parse(event.body);
    const eventType = body.eventType;

    if (!eventType) {
      throw new Error("Event type is missing from the payload.");
    }

    const eventQueueMapping = {
      ORDER_CALLBACK: process.env.AP_QUEUE_URL,
    };

    let queueUrl = eventQueueMapping[eventType];

    if (!queueUrl) {
      throw new Error("Event type does not correspond to queue URL.");
    }

    if (process.env.ENVIRONMENT === "local") {
      queueUrl = queueUrl.replace("localhost", "host.docker.internal");
    }

    await sqs
      .sendMessage({
        MessageBody: JSON.stringify(body.data),
        QueueUrl: queueUrl,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Success sending message to SQS.",
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed sending message to SQS.",
        error: err.message,
      }),
    };
  }
};
