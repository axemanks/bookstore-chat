'use server';
import { PineconeClient, CreateCollectionRequest } from '@pinecone-database/pinecone';

interface createCollection {
  collectionName: string;
}

export async function createCollection(collectionName: string) {
  console.log('Creating a new collection...');
  const apiKey: string = process.env.PINECONE_API_KEY || '';
  const environment: string = process.env.PINECONE_ENVIRONMENT || '';

  const pinecone: PineconeClient = new PineconeClient();
  try {
    await pinecone.init({
      environment,
      apiKey,
    });
    // on success do the following

    // construct the collection
    const createCollectionRequest: CreateCollectionRequest = {
      name: collectionName,
      source: indexName,
    };

    // send to pinecone
    await pinecone.createCollection({ createCollectionRequest });

    console.log(`Collection "${collectionName}" created.`);
    return { collectionName };

  } catch (error) {
    console.log('Error connecting to Pinecone during createCollection:', error);
  }
}
