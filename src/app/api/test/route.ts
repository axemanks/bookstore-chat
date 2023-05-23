// https://js.langchain.com/docs/modules/chains/index_related_chains/retrieval_qa

export async function GET(request: Request) {
    return new Response("Hello Keith!");
    
}

export async function POST(req: Request) {
    const body = await req.json();
    console.log(body)

    return new Response("It's nice to see you!");
}