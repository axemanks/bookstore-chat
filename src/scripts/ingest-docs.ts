

const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { CohereEmbeddings } = require('langchain/embeddings/cohere');
const { PineconeStore } = require('langchain/vectorstores/pinecone');
const { pinecone } = require('./src/utils/pinecone-client.ts')
const { CustomPDFLoader } = require('../utils/customPDFLoader');
const { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } = require('../config/pinecone');
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory');
const { PineconeClient } = require('@pinecone-database/pinecone');




// Load environment variables from .env file
require('dotenv').config();

// Access and test log the environment variables
console.log('PINECONE_ENVIRONMENT:', process.env.PINECONE_ENVIRONMENT);
console.log('PINECONE_API_KEY:', process.env.PINECONE_API_KEY);

// used for TS issues
require('dotenv').config();
require('ts-node').register({
  transpileOnly: true,
  project: 'tsconfig.json'
});

require('./src/scripts/ingest-docs');

/* Name of directory to retrieve your files from */
const filePath = 'docs';

const run = async () => {
  try {
    /*load raw docs from all files in the directory */
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path: any) => new CustomPDFLoader(path),
    });

    const rawDocs = await directoryLoader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000, // size of each chunk in characters
      chunkOverlap: 200, // overlap is data that is copied into both chunks so no data loss
    });

    // split the documents into chunks
    const docs = await textSplitter.splitDocuments(rawDocs);
    // console confirmation of split
    console.log('split docs', docs);

    console.log('creating vector store...');
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new CohereEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME); // from .env PINECONE_INDEX_NAME

    // embed the PDF documents
    
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: PINECONE_NAME_SPACE, // consider implementing different namespaces for different documents - could be title of document
      textKey: 'text',
    });
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
}

(async () => {
  await run();
  console.log('ingestion complete');
})();
