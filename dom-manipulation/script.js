let quotes = [];
let selectedCategory = 'all';

async function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    quotes = storedQuotes;
}

async function saveQuotes() {
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
    selectedCategory = lastSelectedCategory;
    categoryFilter.value = selectedCategory;
}

function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

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

function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    selectedCategory = categoryFilter;
    localStorage.setItem('lastCategory', selectedCategory);
    showRandomQuote();
}

function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

function createAddQuoteForm() {
    const formContainer = document.createElement('div');

    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.onclick = addQuote;

    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);

    document.body.appendChild(formContainer);
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverQuotes = await response.json();
        
        serverQuotes.forEach(quote => {
            quotes.push({ text: quote.title, category: "General" });
        });

        saveQuotes();
        populateCategories();
        showRandomQuote();
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadQuotes();
    populateCategories();
    showRandomQuote();
    createAddQuoteForm();
    await fetchQuotesFromServer();
});
