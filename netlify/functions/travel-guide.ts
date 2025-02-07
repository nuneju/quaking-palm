import { type Config } from "@netlify/functions";

export default async (req: Request) => {
  const pattern = new URLPattern({ pathname: "/travel-guide/:city/:country" });
  const match = pattern.exec(new URL(req.url).pathname);

  if (!match) {
    return new Response("Invalid URL format", { status: 400 });
  }

  const city = match.pathname.groups.city;
  const country = match.pathname.groups.country;

  return new Response(`You're visiting ${city} in ${country}!`);
};

export const config: Config = {
  path: "/travel-guide/:city/:country",
};