const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const dynamoDb = new DynamoDB({});
const tableName = process.env.HEALTH_DATA_TABLE_NAME;

exports.handler = async (event) => {
  const { httpMethod, queryStringParameters, body } = event;

  if (httpMethod === 'GET') {
    const userId = queryStringParameters?.userId || "user789";
    const startDate = queryStringParameters?.startDate || '2024-01-01T00:00:00Z';
    const endDate = queryStringParameters?.endDate || new Date().toISOString();

    if (userId) {
      const params = {
        TableName: tableName,
        KeyConditionExpression: 'userId = :userId AND #ts BETWEEN :startDate AND :endDate',
        ExpressionAttributeNames: {
          '#ts': 'timestamp', 
        },
        ExpressionAttributeValues: {
          ':userId': { S: userId },
          ':startDate': { S: startDate },
          ':endDate': { S: endDate },
        },
      };

      console.log("Query parameters:", params);

      try {
        const data = await dynamoDb.query(params);
        console.log("Query result:", data);

        const items = data.Items?.map(item => ({
          timestamp: item.timestamp.S,
          bloodPressure: item.bloodPressure.S,
          bmi: parseFloat(item.bmi.N || '0'),
          diabetesRisk: item.diabetesRisk.S,
        }));
        
        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
          body: JSON.stringify(items),
        };
      } catch (error) {
        console.error("Query error:", error);
        return {
          statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
          body: JSON.stringify({ error: "Could not retrieve health data.", error }),
        };
      }
    }

    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    },
      body: JSON.stringify({ error: "userId is required for querying data" }),
    };
  }

  if (httpMethod === 'POST') {
    const { userId, bloodPressure, bmi, diabetesRisk } = JSON.parse(body || '{}');
    const timestamp = new Date().toISOString();

    if (!userId || !bloodPressure || !bmi || !diabetesRisk) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*", // Or specify your domain
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
      },
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const putParams = {
      TableName: tableName,
      Item: {
        userId: { S: userId },
        timestamp: { S: timestamp },
        bloodPressure: { S: bloodPressure },
        bmi: { N: bmi.toString() },
        diabetesRisk: { S: diabetesRisk },
      },
    };

    try {
      await dynamoDb.putItem(putParams);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Or specify your domain
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
      },
        body: JSON.stringify({ message: "Health data saved successfully." }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*", // Or specify your domain
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
      },
        body: JSON.stringify({ error: "Could not save health data." }),
      };
    }
  }

  return {
    statusCode: 400,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
  },
    body: JSON.stringify({ error: "Invalid request method" }),
  };
};
