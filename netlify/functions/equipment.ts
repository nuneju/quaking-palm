import { builder, type Handler, type Config, type Context } from "@netlify/functions";


export default async (req, context: Context) => {

    try {

        const url = new URL(req.url);
        const params = new URLSearchParams(url.search);
        const name = params.get('name');
        const realm = params.get('realm')


        console.log('params', params)
        // Fetch the response from the "on-demand-builder" function
        const builderResponse = await fetch(`${process.env.URL}/.netlify/functions/on-demand-builder`,
            {
                headers: {
                    'X-API-Key': process.env.LOCAL_API_KEY
                },
            }
        );
        console.log('builderResponse', builderResponse)
        // Check if the response is successful
        if (!builderResponse.ok) {
            throw new Error(`Failed to fetch data: ${builderResponse.statusText}`);
        }

        // Parse the response data
        const builderData = await builderResponse.json();


        const accessToken = builderData.token;

        let apiUrl = new URL(`https://us.api.blizzard.com/profile/wow/character/${realm}/${name}/equipment`);
        apiUrl.search = new URLSearchParams({ namespace: "profile-us", locale: "en_US" }).toString();
        try {

            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },

            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error fetching character equipment:", errorData);
                return new Response(JSON.stringify({ error: "Character not found or API error" }), {
                    status: response.status,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const data = await response.json();

            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Error fetching character equipment:", error.response.data || error.message);
            throw new Error("Character not found or API error");
        }


        // Return the fetched data as a JSON response
        return new Response(JSON.stringify({ "a": "b" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: `Failed to fetch builder data: ${error.message}` }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
};


