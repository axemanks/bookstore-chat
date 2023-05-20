const axios = require('axios').default;
const cheerio = require('cheerio');

async function scrapeBooks(limit = 10) {
  const baseUrl = 'https://books.toscrape.com/catalogue/';
  const books = [];
  let currentPage = 1;
  let hasNextPage = true;
  let counter = 0;

  while (hasNextPage && counter < limit) {
    const pageUrl = `page-${currentPage}.html`;
    const response = await axios.get(baseUrl + pageUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract book links from the page
    const bookLinks = $('.product_pod h3 a');

    // Iterate through each book link
    for (let j = 0; j < bookLinks.length; j++) {
      const bookPath = $(bookLinks[j]).attr('href');
      await fetchBookData(bookPath);
      counter++;

      if (counter >= limit) {
        break;
      }
    }

    // Check if there is a next page
    const nextPageLink = $('.next a');
    hasNextPage = nextPageLink.length > 0;

    if (hasNextPage) {
      currentPage++;
    }
  }
}

// Usage: Call the scrapeBooks function with the desired limit
scrapeBooks(10);

async function fetchBookData(bookPath: any) {
  const bookUrl = `https://books.toscrape.com/catalogue/${bookPath}`;
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

    console.log('Title:', title);
    console.log('Price:', price);
    console.log('Description:', description);
    console.log('Description Length:', descriptionLength);
    console.log('In Stock:', inStock);
    console.log('URL:', bookUrl);
  } catch (error) {
    console.error('Error fetching book data:', error);
  }
}
