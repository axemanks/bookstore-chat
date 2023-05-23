// this script scrapes the books.toscrape.com website and sends the data to Pinecone
// const { PineconeClient } = require('@pinecone-database/pinecone');
const axios = require('axios');
const cheerio = require('cheerio');

// Load environment variables from .env file
require('dotenv').config();

// Initialize Pinecone client
const pineconeClient = new PineconeClient(process.env.PINECONE_API_KEY, process.env.PINECONE_ENVIRONMENT);
// Set index name
const indexName = process.env.PINECONE_INDEX_NAME || '';

// Define your index configuration
const indexConfig = {
  name: 'Bookstore-index',
  metric: 'euclidean',
  shards: 1,
  replicas: 0,
};

// Create or get the index
async function createOrGetIndex() {
  try {
    const index = await pineconeClient.createIndex(indexConfig);
    console.log('Index created:', index);
  } catch (error: any) {
    if (error.message.includes('Index already exists')) {
      console.log('Index already exists');
    } else {
      console.error('Error creating or getting index:', error);
    }
  }
}


// Limit to 10 books during testing
async function scrapeBooks(limit = 10) {
  // Base URL for the catalog
  const baseUrl = 'https://books.toscrape.com/'
  const books = [];
  let counter = 0;  

  // Fetch book data from a given book path
  async function fetchBookData(bookPath: any) {
    const bookUrl = `${baseUrl}${bookPath}`;
    try {
      const response = await axios.get(bookUrl);
      const html = response.data;
      const $ = cheerio.load(html);

      // Extract book data from the HTML
      const title = $('h1').text();
      const price = $('.price_color').first().text();
      const description = $('.product_page > p').text();
      const descriptionLength = description.length;
      const inStock = $('.availability').text().trim() === 'In stock';

      // Create an object with the book data
      const bookData = {
        title,
        price,
        description,
        descriptionLength,        
        inStock,
        url: bookUrl,
      };
      // testing - object is being created successfully
      // console.log('bookData constructed', bookData);
      
      return bookData;
    } catch (error) {
      console.error('Error extracting book data:', error);
      return undefined;
    }
  }

  // Send book data to Pinecone
  async function sendBookDataToPinecone(bookData: { title?: any; price?: any; description?: any; descriptionLength?: any; inStock?: boolean; url: any; }) {
    try {
      const jsonData = JSON.stringify(bookData);
      const index = pineconeClient.getIndex(indexName);
      await index.upsert([{ id: bookData.url, vector: jsonData }]);
      console.log('Book data sent to Pinecone:', bookData);
    } catch (error: any) {
      console.error('Error sending book data to Pinecone:', error);
    }
  }

  // Start scraping the books
  const response = await axios.get(`${baseUrl}index.html`);
  const html = response.data;
  const $ = cheerio.load(html);

  // Extract book links from the page
  const bookLinks = $('.product_pod h3 a');

  // Iterate through each book link
  for (let j = 0; j < bookLinks.length && counter < limit; j++) {
    const bookPath = $(bookLinks[j]).attr('href');
    const bookData = await fetchBookData(bookPath);
    
    counter++;

    if (bookData) {
      // Send the bookData to Pinecone
      await sendBookDataToPinecone(bookData);
      console.log('Book data extracted:', bookData);
    }
  }
}

// Usage: Call the scrapeBooks function with the desired limit
createOrGetIndex().then(() => {
  // Call the scrapeBooks function with the desired limit
  scrapeBooks(1);
});
