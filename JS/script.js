class Piece{
    constructor(title, text, genre, author = "Anonimo", words = 0) {
        this.title = title;
        this.text = text;
        this.genre = genre;
        this.author = author;
        this.words = this.text.match(/(\w+)/g).length;
    }

    countWords() {
        return this.text.match(/(\w+)/g).length;
    }
    
    countPages() {
        document.getElementById('pageCount').innerText = Math.ceil(this.words / wordsPerPage);
    }
    
    capitalizeText() {
        let sentenceRegex = /.+?([\.\?\!\;]\s|$)/g;
        let capitalizedText = this.text.replace(sentenceRegex, function (sentence) {
            return sentence.charAt(0).toUpperCase() + sentence.substr(1).toLowerCase();
        });
        document.getElementById('capitalizedText').value = capitalizedText;
    }

    addToTable() {
        let table = document.getElementById("pieceTable");
        let newRow   = table.insertRow();
      
        const keys = Object.keys(this)
        for (const key of keys) {
              if(key != "text") {
                  let newCell  = newRow.insertCell();
                  newCell.innerHTML = this[key];
              }
          }
      }

}

let wordsPerPage = 500;
let book = [];
let currentBookIndex = 0;
let span = document.getElementsByClassName("close")[0];
let nextPiece = document.getElementById("nextPiece");
let previousPiece = document.getElementById("previousPiece");

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

 //event listener for book sorting       
 document.querySelector('.sortBook').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    sortBook(formData.get("sortCriteria"));   
});     

 //event listener for creating a book with selected pieces
document.getElementById('createBookButton').addEventListener('click', (e) => {
    e.preventDefault();
    let bookModal = document.getElementById("bookModal");
    displayPieceOnModal(currentBookIndex);
    bookModal.style.display = "block";
});

span.onclick = function() {
    bookModal.style.display = "none";
  }

nextPiece.onclick = function() {
    if(currentBookIndex + 1 < book.length) {
        displayPieceOnModal(++currentBookIndex);
    } 
}

previousPiece.onclick = function() {
    if(currentBookIndex - 1 >= 0) {
        displayPieceOnModal(--currentBookIndex);
    } 
}

function displayPieceOnModal(currentBookIndex) {
    const currentPiece = book[currentBookIndex];

    let modal = document.getElementById("pieceModal");
    modal.innerHTML="";
    
    let title = document.createElement("h3");
    title.textContent = currentPiece.title;

    let author = document.createElement("cite");
    author.textContent = "Autor: " + currentPiece.author;

    let pieceText = document.createElement("p");
    pieceText.textContent = currentPiece.text;

    modal.appendChild(title);
    modal.appendChild(author);
    modal.appendChild(pieceText);

}

function performSelectedOperations(formData) {
    const piece = new Piece(formData.get("title"), formData.get("pieceInput"), formData.get("genre"), formData.get("author"));
    
    book.push(piece);

    if (formData.get("countWords")) {
        document.getElementById('wordCount').innerText = piece.words;
    }

    if (formData.get("countPages")) {
        piece.countPages();
    }

    if (formData.get("capitalizeText")) {
        piece.capitalizeText();
    }

    piece.addToTable();
}

function sortBook(criteria) {
    book.sort(sortByProperty(criteria));
    let table = document.getElementById("pieceTable");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    book.forEach(piece => piece.addToTable());
}

function sortByProperty(property) {
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result;
    }
    
}

