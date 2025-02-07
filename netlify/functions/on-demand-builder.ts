import { builder, type Handler } from "@netlify/functions";


const getClientKey = () => {
  return process.env.BLIZZARD_CLIENT_ID;
};
const getClientSecret = () => {
  return process.env.BLIZZARD_CLIENT_SECRET;
};

export const myHandler: Handler = async (event, context) => {
  const requestKey = event.headers['x-api-key'];
  console.log('event', event);
  console.log('event.headers', event.headers);
  const apiKey = process.env.LOCAL_API_KEY
  console.log('requestKey', requestKey);
  console.log('apiKey', apiKey)
  if (requestKey !== apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'no access' })
    }
  }



  const CLIENT_ID = getClientKey();
  const CLIENT_SECRET = getClientSecret();


  try {

    const response = await fetch("https://us.battle.net/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    console.log(data.access_token); // Should return access_token


    return {
      statusCode: 200,
      body: JSON.stringify({ token: data.access_token }),
      ttl: 3600,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to make POST request' })
    };
  }
};

const handler = builder(myHandler);

export { handler };


