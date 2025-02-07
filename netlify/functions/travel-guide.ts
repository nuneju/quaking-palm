import { Config, Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const { city, country } = context.params

  return new Response(`Travel guide for ${city} in ${country}!`)
}

export const config: Config = {
  path: "/travel-guide/:country/:city"
}