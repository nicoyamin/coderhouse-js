class Piece{
    constructor(title, text, genre, author = "Anonimo", words = 0) {
        this.title = title;
        this.text = text;
        this.genre = genre;
        this.author = author;
        this.words = words;
    }

}

let wordsPerPage = 500;
let book = [];

//Submits text entered by user and performs selected operations
document.querySelector('.textForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if(formData.get("pieceInput") === "") {
        alert("Por favor ingrese un texto!");
    } else {
        performSelectedOperations(formData);
    }
});

//If user chooses to upload file, parses JSON and fills the form fields
document.getElementById('inputFile').addEventListener('change', function() {
              
            var fileReader = new FileReader();
            fileReader.onload=function(){
                let loadedPiece = JSON.parse(fileReader.result);
                console.log(loadedPiece);

                document.getElementById('title').value = loadedPiece["title"];
                document.getElementById('author').value = loadedPiece["author"];
                document.getElementById('genre').value = loadedPiece["genre"];
                document.getElementById('pieceInput').innerText = loadedPiece["text"];
            }
              
            fileReader.readAsText(this.files[0]);
        })

 document.querySelector('.sortBook').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    sortBook(formData.get("sortCriteria"));   
});       

function performSelectedOperations(formData) {
    let wordCount = countWords(formData.get("pieceInput"));
    const piece = new Piece(formData.get("title"), formData.get("pieceInput"), formData.get("genre"), formData.get("author"), wordCount);
    book.push(piece);
    console.log(book);

    if (formData.get("countWords")) {
        document.getElementById('wordCount').innerText = wordCount;
    }

    if (formData.get("countPages")) {
        countPages(piece.words);
    }

    if (formData.get("capitalizeText")) {
        capitalizeText(piece.text);
    }
}

function countWords(text) {
    let wordCount = text.match(/(\w+)/g).length;
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

function sortBook(criteria) {
    book.sort(sortByProperty(criteria));
    alert("Obras ordenadas. Observar resultados en consola");
    console.log(book);
}

function sortByProperty(property) {
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result;
    }
}
