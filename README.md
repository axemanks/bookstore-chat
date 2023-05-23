# Bookstore chat - Bookbuddy

Origianal inspiration- https://www.youtube.com/watch?v=KiWClrSVgfU
##
.env.local is used, does not need NEXT_PUBLIC_ on the variables.


to start:
npm run dev
To ingest new docs- only needs to be done once
npm run ingest

Chroma: db
docker-compose up -d --build

Scrape Schema:
url: The URL of the book
title: title of the book
desc: A description of the book
price: The price of the book
availability: The availability of the book (in stock or out of stock)