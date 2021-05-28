import Piece from './Piece.js';

$(document).ready(function() {
    
    let book = [];
    let currentBookIndex = 0;

    const API_URL = "https://openlibrary.org";
    const API_OUTPUT_FORMAT = ".json";
    const LIMIT = "?limit=30";
    const EMPTY_STRING = '';
    const NO_BOOK_DESCRIPTION = "No description/text available"
    
    //Submits text entered by user and performs selected operations
    $('.textForm').submit(function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        if(formData.get("pieceInput") === "") {
            alert("Por favor ingrese un texto!");
        } else {
            performSelectedOperations(formData);
        }
    
        $('#title').val(EMPTY_STRING);
        $('#author').val(EMPTY_STRING);
        $('#genre').val(EMPTY_STRING);
        $('#pieceInput').val(EMPTY_STRING);

    });
    
    //If user chooses to upload file, parses JSON and fills the form fields
    $('#inputFile').on('change', function() {
                  
                let fileReader = new FileReader();
                fileReader.onload=function(){
                    let loadedPiece = JSON.parse(fileReader.result);
    
                    $('#title').val(loadedPiece["title"]); 
                    $('#author').val(loadedPiece["author"]);
                    $('#genre').val(loadedPiece["genre"]);
                    $('#pieceInput').val(loadedPiece["text"]);
                }                
                fileReader.readAsText(this.files[0]);
            })

    //If user chooses to get a recommendation, initiate AJAX call
    $('#suggestButton').on('click', function() {
        
        let subject = ""; 

        if($('#inputSubject').val() === "") {
            alert("Por favor ingrese un tema!");
        } else {
            subject = $('#inputSubject').val();
            getRecommendationOnSubject(subject);
        }        
    });
    
     //event listener for book sorting       
     $('.sortBook').submit(function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        sortBook(formData.get("sortCriteria"));   
    });     
    
     //event listener for creating a book with selected pieces
    $('#createBookButton').on('click', function() {
        displayPieceOnModal(currentBookIndex);
        $("#bookModal").css("display","block")
    });

    $('.close').first().on('click', function() {
        $("#bookModal").css("display","none")
    });
    
    $('#nextPiece').on('click', function() {
        if(currentBookIndex + 1 < book.length) {
            displayPieceOnModal(++currentBookIndex);
        } 
    });

    $('#previousPiece').on('click', function() {
        if(currentBookIndex - 1 >= 0) {
            displayPieceOnModal(--currentBookIndex);
        } 
    });
    
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
            $('#wordCount').text(piece.words);
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
            let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result;
        }
        
    }

    //Call subjects API based on user input
    function getRecommendationOnSubject(subject) {
        const SUBJECT_API = "/subjects/";

        console.log(API_URL + SUBJECT_API + subject + API_OUTPUT_FORMAT + LIMIT);
        $.ajax({
            method: "GET",
            url: API_URL + SUBJECT_API + subject + API_OUTPUT_FORMAT + LIMIT,
            success: function(bookList) {
                parseRecommendedBooks(bookList.works);
            }
        })
    }
    
    //Get a random book from subject list and parses its values
    function parseRecommendedBooks(bookList) {

        let randomBookIndex = Math.floor(Math.random() * bookList.length);
        let randomBook = bookList[randomBookIndex];
        $.ajax({
            method: "GET",
            url: API_URL + randomBook.key + API_OUTPUT_FORMAT,
            success: function(bookInfo) {
                $('#title').val(bookInfo.title); 
                $('#author').val(randomBook.authors[0].name);
                $('#genre').val(randomBook.subject[0]);
                if(bookInfo.hasOwnProperty('description') && bookInfo.description.hasOwnProperty('value') && bookInfo.description.value != "") {
                    $('#pieceInput').val(bookInfo.description.value);            
                } else {
                    $('#pieceInput').val(NO_BOOK_DESCRIPTION);            
                }
            }
        })
    }
    
});
