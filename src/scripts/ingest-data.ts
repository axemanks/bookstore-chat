const axios = require('axios');

async function fetchBookData() {
  try {
    const url = 'http://books.toscrape.com/catalogue/category/books/science_22/index.html';
    const response = await axios.get(url);
    const html = response.data;

    // Extract book titles using regex
    const titlesRegex = /<h3(?:.*?)>\s*<a(?:.*?)>(.*?)<\/a>\s*<\/h3>/g;
    const titles = [];
    let match;
    while ((match = titlesRegex.exec(html)) !== null) {
      titles.push(match[1]);
    }

    // Print the book titles
    console.log(titles);
  } catch (error) {
    console.error('Error fetching book data:', error);
  }
}

fetchBookData();
