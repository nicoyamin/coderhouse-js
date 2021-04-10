class Piece{
    constructor(title, text, genre, author = "Anonimo") {
        this.title = title;
        this.text = text;
        this.genre = genre;
        this.author = author;
    }

}

let wordsPerPage = 500;

document.querySelector('.textForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if(formData.get("pieceInput") === "") {
        alert("Por favor ingrese un texto!");
    } else {
        performSelectedOperations(formData);
    }
});

function performSelectedOperations(formData) {
    let wordCount = 0;
    const piece = new Piece(formData.get("title"), formData.get("pieceInput"), formData.get("author"), formData.get("genre"));

    console.log(piece);

    if (formData.get("countWords")) {
        wordCount = countWords(piece.text);
    }

    if (formData.get("countPages")) {
        if (!formData.get("countWords")) {
            wordCount = countWords(piece.text);
        }
        countPages(wordCount);
    }

    if (formData.get("capitalizeText")) {
        capitalizeText(piece.text);
    }
}

function countWords(text) {
    let wordCount = text.match(/(\w+)/g).length;
    document.getElementById('wordCount').innerText = wordCount;
    return wordCount;
}

function countPages(wordCount) {
    let pageCount = Math.ceil(wordCount / wordsPerPage);
    document.getElementById('pageCount').innerText = pageCount;

}

function capitalizeText(text) {
    let sentenceRegex = /.+?([\.\?\!\;]\s|$)/g;
    let capitalizedText = text.replace(sentenceRegex, function (sentence) {
        return sentence.charAt(0).toUpperCase() + sentence.substr(1).toLowerCase();
    });
    document.getElementById('capitalizedText').value = capitalizedText;
}
