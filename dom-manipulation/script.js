let quotes = [];


function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    quotes = storedQuotes;
}


function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))];

         categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const lastSelectedCategory = localStorage.getItem('lastCategory') || 'all';
    categoryFilter.value = lastSelectedCategory;
}


function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const categoryFilter = document.getElementById('categoryFilter').value;

    const filteredQuotes = categoryFilter === 'all' ? quotes : quotes.filter(quote => quote.category === categoryFilter);

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
}


function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText.trim() === "" || quoteCategory.trim() === "") {
        alert("Both fields are required!");
        return;
    }
    
    quotes.push({ text: quoteText, category: quoteCategory });
    saveQuotes();
    populateCategories();
    showRandomQuote();

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
}






document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    populateCategories();
    showRandomQuote();
});
