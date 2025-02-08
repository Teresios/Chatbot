import { Configuration, OpenAIApi } from "openai-edge";

export const runtime = 'edge';
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(config);

export async function POST(request: Request) {
    const { message } = await request.json();
    console.log(message);

    const response = await openai.createChatCompletion({
        model: "gpt-4o-mini",
        stream: true,
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message }
        ]
    });

    const stream = await OpenAIStream(response);
    return StreamingTextResponse(stream);
}

async function OpenAIStream(response: Response): Promise<ReadableStream> {
    const reader = response.body?.getReader();
    const stream = new ReadableStream({
        async start(controller) {
            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;
                controller.enqueue(value);
            }
            controller.close();
        }
    });
    return stream;
}

function StreamingTextResponse(stream: ReadableStream): Response {
    return new Response(stream, {
        headers: { 'Content-Type': 'text/event-stream' }
    });
}