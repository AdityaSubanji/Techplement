const quoteText = document.querySelector(".quote"),
    quoteBtn = document.querySelector("button.new-quote"),
    authorSearchBtn = document.querySelector("button.search-author"),
    authorInput = document.querySelector("input.author-input"),
    authorName = document.querySelector(".name"),
    speechBtn = document.querySelector(".speech"),
    copyBtn = document.querySelector(".copy"),
    twitterBtn = document.querySelector(".twitter"),
    synth = speechSynthesis;

async function fetchQuote(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

async function randomQuote() {
    setLoadingState(quoteBtn, true);
    const result = await fetchQuote("https://api.quotable.io/random");
    if (result) {
        quoteText.innerText = result.content;
        authorName.innerText = result.author;
    } else {
        quoteText.innerText = "Failed to load quote. Please try again.";
        authorName.innerText = "";
    }
    setLoadingState(quoteBtn, false);
}

async function quoteByAuthor(author) {
    setLoadingState(authorSearchBtn, true);
    const result = await fetchQuote(`https://api.quotable.io/quotes?author=${author}`);
    if (result && result.results.length > 0) {
        const quote = result.results[0];
        quoteText.innerText = quote.content;
        authorName.innerText = quote.author;
    } else {
        quoteText.innerText = "No quotes found for this author.";
        authorName.innerText = "";
    }
    setLoadingState(authorSearchBtn, false);
}

function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.classList.add("loading");
        button.innerText = "Loading...";
    } else {
        button.classList.remove("loading");
        button.innerText = button.classList.contains("new-quote") ? "New Quote" : "Search Quote";
    }
}

speechBtn.addEventListener("click", () => {
    if (!quoteBtn.classList.contains("loading")) {
        let utterance = new SpeechSynthesisUtterance(`${quoteText.innerText} by ${authorName.innerText}`);
        synth.speak(utterance);
        setInterval(() => {
            !synth.speaking ? speechBtn.classList.remove("active") : speechBtn.classList.add("active");
        }, 10);
    }
});

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(quoteText.innerText);
});

twitterBtn.addEventListener("click", () => {
    let tweetUrl = `https://twitter.com/intent/tweet?url=${quoteText.innerText}`;
    window.open(tweetUrl, "_blank");
});

quoteBtn.addEventListener("click", randomQuote);

authorSearchBtn.addEventListener("click", () => {
    const author = authorInput.value.trim();
    if (author) {
        quoteByAuthor(author);
    }
});
