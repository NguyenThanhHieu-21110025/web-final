const Handlebars = require('handlebars');

// Helper to subtract two numbers
Handlebars.registerHelper('subtract', function(a, b) {
    return a - b;
});

// Helper to add two numbers
Handlebars.registerHelper('add', function(a, b) {
    return a + b;
});

// Helper to check if two values are equal
Handlebars.registerHelper('eq', function(a, b) {
    return a === b;
});

// Helper to generate page numbers
Handlebars.registerHelper('generatePages', function(paginate) {
    const pages = [];
    const start = Math.max(1, paginate.page - 2);  // Start 2 pages before current page
    const end = Math.min(paginate.pages, paginate.page + 2);  // End 2 pages after current page

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return pages;
});
