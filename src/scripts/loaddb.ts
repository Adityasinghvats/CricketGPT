import {DataAPIClient} from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import "dotenv/config";

//use to compute similarity of 2 vectors
//cosine is default dont need normalization, dot prodyct is faster needs normalization
//eculidean is for finding how cloase 2 vectors are 
type SimilarityMetric = "dot_product" | "cosine" | "euclidean"

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY
} = process.env;

const openai = new OpenAI({apiKey: OPENAI_API_KEY});

const cricketdata = [
    'https://en.wikipedia.org/wiki/Cricket',
    'https://www.cricbuzz.com/'
]

//connect to db
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace : ASTRA_DB_NAMESPACE})

//split into chunks for db
//chunk size is for size of one token, overlap is for max amount of overlapping data to preserve context
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize:512,
    chunkOverlap:100,
})

//create collection in astradb with dimensions and similarityMetric
const createCollection = async(similarityMetric: SimilarityMetric = "dot_product") => {
    const res = await db.createCollection(ASTRA_DB_COLLECTION ,{
        vector: {
            dimension: 1536,
            metric:similarityMetric
        }
    })
    console.log(res)
}

//load data to collection
const loadSampleData = async() => {
    const collection = await db.collection(ASTRA_DB_COLLECTION)
    for await (const url of cricketdata){
        const content = await scrapePage(url)
        const chunks = await splitter.splitText(content)
        for await (const chunk of chunks){
            const embedding = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
                encoding_format: "float"
            })

            const vector = embedding.data[0].embedding
            //reponse of array of numbers
            const res = await collection.insertOne({
                $vector: vector,
                text: chunk
            })
            console.log(res)
        }
    }
}

const scrapePage = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions:{
            headless: true
        },
        gotoOptions : {
            waitUntil: "domcontentloaded"
        },
        evaluate : async(page, browser) => {
            const result = await page.evaluate(() => document.body.innerHTML)
            await browser.close()
            return result
        }
    })
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}

createCollection().then(() => loadSampleData())