import { builder, type Handler } from "@netlify/functions";


const getClientKey = () => {
  return Netlify.env.get("BLIZZARD_CLIENT_ID");
};
const getClientSecret = () => {
  return Netlify.env.get("BLIZZARD_CLIENT_SECRET");
};

export const myHandler: Handler = async (event, context) => {
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


