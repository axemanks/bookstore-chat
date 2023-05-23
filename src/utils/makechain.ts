// 1. Import required modules
import { CohereEmbeddings } from "langchain/embeddings/cohere";
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";


// 2. Export the queryPineconeVectorStoreAndQueryLLM function
export const queryPineconeVectorStoreAndQueryLLM = async (
  client: { Index: (arg0: any) => any; },
  indexName: any,
  question: string
) => {
// 3. Start query process
  console.log("Querying Pinecone vector store...");
// 4. Retrieve the Pinecone index
  const index = client.Index(indexName);
  //test
   console.log("Pinecone index:", index);
// 5. Create query embedding
// cohere api key automatically pulled from .env
  const embeddings = new CohereEmbeddings({});
  const queryEmbedding = await embeddings.embedQuery(question); // https://js.langchain.com/docs/modules/models/embeddings/
  console.log("Query embedding:", queryEmbedding);

  
// 6. Query Pinecone index and return top 10 matches
  let queryResponse = await index.query({
    queryRequest: {
      topK: 10, // the 10 most similar documents
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
    },
  });
// 7. Log the number of matches 
  console.log(`Found ${queryResponse.matches.length} matches...`);
// 8. Log the question being asked
  console.log(`Asking question: ${question}...`);
  if (queryResponse.matches.length) {
// 9. Create an OpenAI instance and load the QAStuffChain
    const llm = new OpenAI({});
    const chain = loadQAStuffChain(llm);
// 10. Extract and concatenate page content from matched documents
    const concatenatedPageContent = queryResponse.matches
      .map((match: { metadata: { pageContent: any; }; }) => match.metadata.pageContent)
      .join(" ");
// 11. Execute the chain with input documents and question
    const result = await chain.call({
      input_documents: [new Document({ pageContent: concatenatedPageContent })],
      question: question,
    });
// 12. Log the answer
    console.log("Answer:", result.answers[0].answer);
    // return answer
    return result.answers[0].answer;
  } else {
// 13. Log that there are no matches, so GPT-3 will not be queried
    console.log("Since there are no matches, GPT-3 will not be queried.");
  }
};