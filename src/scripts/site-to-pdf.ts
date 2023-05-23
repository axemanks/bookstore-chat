const fs = require('fs');
const PDFDocument = require('pdfkit');
const axios = require('axios');
const cheerio = require('cheerio');

// this finds all the books to scrape (basic scraping)
async function scrapeBooksToPDF(limit = 5) {
  const baseUrl = 'https://books.toscrape.com/';
  const books = [];

  // Fetch book data from a given book path
  async function fetchBookData(bookPath: any) {
      const bookUrl = `${baseUrl}catalogue/${bookPath}`;
      // for testing
      console.log("bookUrl",bookUrl)
    try {
      const response = await axios.get(bookUrl); // axios gets the data
      const html = response.data; // response.data is the html
      const $ = cheerio.load(html); // cheerio scraptes the html for the detailed data

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
        
      // return the book data
        return bookData;
        // testing
        console.log("bookData",bookData)
    } catch (error) {
      console.error('Error extracting book data:', error);
      return undefined;
    }
  }

  // Fetch all book links from each page
  let currentPage = 1;
  let totalPages = 1;

  while (books.length < limit && currentPage <= totalPages) {
    const response = await axios.get(`${baseUrl}catalogue/page-${currentPage}.html`);
    const html = response.data;
    const $ = cheerio.load(html);

    if (currentPage === 1) {
      const totalBooksText = $('.form-horizontal strong').text();
      totalPages = Math.ceil(parseInt(totalBooksText) / 20);
    }

  // Extract book links from the page
  const bookLinks = $('.product_pod h3 a');

  // Iterate through each book link
  for (let j = 0; j < bookLinks.length && j < limit; j++) {
    const bookPath = $(bookLinks[j]).attr('href');
      const bookData = await fetchBookData(bookPath);
      console.log("books",j)

    if (bookData) {
      books.push(bookData);
    }
      }
      currentPage++;
}

  // Create PDF document
    const doc = new PDFDocument();
    const outputPath = './src/docs/sitemap.pdf'; // adjust the name here
  doc.pipe(fs.createWriteStream(outputPath));

  // Add book data to PDF
  for (const book of books) {
    doc.text(`Title: ${book.title}`);
    doc.text(`Price: ${book.price}`);
    doc.text(`Description: ${book.description}`);
    doc.text(`Description Length: ${book.descriptionLength}`);
    doc.text(`In Stock: ${book.inStock}`);
    doc.text(`URL: ${book.url}`);
    doc.text('----------------------');
  }

  doc.end();
  console.log(`Books saved to to ${outputPath}`);
}

// Usage: Call the scrapeBooksToPDF function with the desired limit
scrapeBooksToPDF(1000);
