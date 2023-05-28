'use server';
import { PineconeClient } from '@pinecone-database/pinecone';

interface PineconeData {
  data: any;
}

export async function getPineconeData(): Promise<PineconeData> {
  console.log('Getting DB stats...');
  const apiKey: string = process.env.PINECONE_API_KEY || '';
  const environment: string = process.env.PINECONE_ENVIRONMENT || '';

  const pinecone: PineconeClient = new PineconeClient();
  try {
    await pinecone.init({
      environment,
      apiKey,
    });
  } catch (error) {
    console.log('Error connecting to Pinecone:', error);
  }

  const indexes = await pinecone.listIndexes();
  const indexName = indexes[0];
  const indexDescription = await pinecone.describeIndex({
    indexName: indexName as string,
  });

  const metrics = indexDescription.database?.metric;
  const dimensions = indexDescription.database?.dimensions;
  const pods = indexDescription.database?.pods;
  const replicas = indexDescription.database?.replicas;
  const shards = indexDescription.database?.shards;
  const podType = indexDescription.database?.podType;

  const collectionsList = await pinecone.listCollections();
  const collectionName = collectionsList[0];
  const describeCollection = await pinecone.describeCollection({
    collectionName,
  });

  const collectionSize = describeCollection.size;
  const collectionStatus = describeCollection.status;

  const pineconeData: PineconeData = {
    data: {
      indexName: indexName,
      metrics: metrics,
      dimensions: dimensions,
      pods: pods,
      replicas: replicas,
      shards: shards,
      podType: podType,
      collectionsList,
      collectionName: collectionName,
      collectionSize: collectionSize,
      collectionStatus: collectionStatus,
    },
  };

  return pineconeData;
}
