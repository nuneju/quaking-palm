import { type Config, type Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
    const { realm, name } = context.params
    var data = {
        [realm]: name,
        value: Math.random() * 10
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var init = {
        "status": 200,
        "statusText": "ok",
        "headers": {
            "Content-Type": "text/plain",
            "Netlify-CDN-Cache-Control": "public, s-maxage=30, durable"
        }
    };
    var myResponse = new Response(blob, init);
    return myResponse
}

export const config: Config = {
    path: "/equipment/:realm/:name"
}