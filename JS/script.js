
let wordsPerPage = 500;

document.querySelector('.textForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if(formData.get("pieceInput") === "") {
        alert("Por favor ingrese un texto!");
    } else {
        processText(formData);
    }

});

function processText(formData) {
    let wordCount = 0;
    let pieceText = formData.get("pieceInput");

    if (formData.get("countWords")) {
        wordCount = countWords(pieceText);
    }

    if (formData.get("countPages")) {
        if (!formData.get("countWords")) {
            wordCount = countWords(pieceText);
        }
        countPages(wordCount);
    }

    if (formData.get("capitalizeText")) {
        capitalizeText(pieceText);
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
