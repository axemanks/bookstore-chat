import type { NextApiRequest, NextApiResponse } from 'next';
import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from 'dotenv';
import { queryPineconeVectorStoreAndQueryLLM } from '../../../utils/makechain';

dotenv.config();
// init pinecone
// have to use this async function
(async () => {
  // Set index name
  const indexName = process.env.PINECONE_INDEX_NAME ?? '';

  // Initialize Pinecone client
  const pinecone = new PineconeClient();
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY as string,
    environment: process.env.PINECONE_ENVIRONMENT as string,
  });
  // console.log(pinecone);
})
  
  export async function GET(request: Request) {
    return new Response("Hello Keith!");
    
  }

  export async function POST(req: Request) {
    const question = await req.json();
    console.log(question)
    // Set index name
    const indexName = process.env.PINECONE_INDEX_NAME ?? '';

    // Initialize Pinecone client
    const pinecone = new PineconeClient();
    await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY as string,
    environment: process.env.PINECONE_ENVIRONMENT as string,
  });
          
    const llmResponse = await queryPineconeVectorStoreAndQueryLLM(pinecone, indexName, question);
      
    return new Response(JSON.stringify(llmResponse));
  }
  