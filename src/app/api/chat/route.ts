import OpenAI from "openai";
import  {streamText} from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { openai } from '@ai-sdk/openai';

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY
} = process.env;

const openAI = new OpenAI({
    apiKey: OPENAI_API_KEY
})

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace : ASTRA_DB_NAMESPACE})

export async function POST(req: Request){
    try {
        const {messages} = await req.json()
        const latestMessage = messages[messages?.length -1]?.content

        let docContext = ""
        const embedding = await openAI.embeddings.create({
            model: "text-embedding-3-small",
            input: latestMessage,
            encoding_format: "float"
        })


        try{
            const collection = await db.collection(ASTRA_DB_COLLECTION)
            const cursor = collection.find(null, {
                sort:{
                    $vector: embedding.data[0].embedding,
                },
                limit: 10
            })

            const docs = await cursor.toArray()

            const docmap = docs?.map(doc => doc.text)
            docContext = JSON.stringify(docmap)
        }catch(err){
            console.log("Error quering embedding", err)
            docContext = ""
        }

        const template = {
            role: "system",
            content: `You are an AI assistant who knows everything about Cricket.
            Use below context to augment ehat you know about Cricket sport.
            THe context will provide you with the most recent page data from wikipedia,
            the circbuzz website and others.
            If the context doesn't include the information you need answer based on your existing
            knowledge and don't mention the source of your information or what context does
            or doesn't include.
            Format responses using markdown where applicable and don't return images
            ------------
            START CONTEXT
            ${docContext}
            END CONTEXT
            ------------
            QUESTION: ${latestMessage}
            ------------
            `
        }

        // const response = await openai.chat.completions.create({
        //     model: "gpt-4",
        //     stream: true,
        //     messages: [template, ...messages]
        // })
        const result = streamText({
            model: openai('gpt-4o'),
            messages: [template, ...messages],
          });

        return result.toDataStreamResponse();

        

    } catch (error) {
        console.log("Error querying db" ,error)
        throw error
    }
}