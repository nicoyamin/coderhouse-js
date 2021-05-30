import Piece from './Piece.js';

$(document).ready(function() {
    
    let book = [];
    let currentBookIndex = 0;
    let currentTab = 0;

    const API_URL = "https://openlibrary.org";
    const API_OUTPUT_FORMAT = ".json";
    const LIMIT = "?limit=30";
    const EMPTY_STRING = '';
    const NO_BOOK_DESCRIPTION = "No description/text available"
    
    showTab(currentTab);

    //Submits text entered by user and performs selected operations
    $('.pieceForm').submit(function(e) {
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

        $('.bookTitle').text(formData.get("inputBookTitle"));
        $('.bookAuthor').text(formData.get("inputBookAuthor"));

        nextPrev(1);
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

    $('#createBookButton').on('click', function() {
        $("#newPage div").remove();
        book.forEach(piece => addPieceToBook(piece));
    });


    $('#pagePrev').on( 'click', function() {
        let content = $('#newBook').children('div.bk-page').children('div.bk-content');
        if( currentBookIndex > 0 ) {
            --currentBookIndex;
            content.removeClass( 'bk-content-current' ).eq( currentBookIndex ).addClass( 'bk-content-current' );
        }
        return false;
    } );

    $('#pageNext').on( 'click', function() {
        let content = $('#newBook').children('div.bk-page').children('div.bk-content');
        if( currentBookIndex < content.length - 1 ) {
            ++currentBookIndex;
            content.removeClass( 'bk-content-current' ).eq( currentBookIndex ).addClass( 'bk-content-current' );
        }
        return false;
    } );

    $('.prevBtn').on( 'click', function() {
        nextPrev(-1);
    } );

    $('.nextBtn').on( 'click', function() {
        nextPrev(1);
    } );

    $('.nextPiece').on( 'click', function() {
        nextPrev(-2);
    } );

    $('#viewContent').on('click', function() {

        let newBook = $("#newBook");
        let content = $('#newBook').children('div.bk-page').children('div.bk-content');

        if( newBook.data( 'opened' ) ) {
            newBook.removeClass( 'bk-active' );
            newBook.data( { opened : false, flip : false } ).removeClass( 'bk-viewinside' ).addClass( 'bk-bookdefault' );
        }
        else {
            newBook.addClass( 'bk-active' );
            newBook.data( { opened : true, flip : false } ).removeClass( 'bk-viewback bk-bookdefault' ).addClass( 'bk-viewinside' );
            currentBookIndex = 0;
            content.removeClass( 'bk-content-current' ).eq( currentBookIndex ).addClass( 'bk-content-current' );
        }
    });
    

    function addPieceToBook(currentPiece) {

        let content = document.createElement("div");
        content.classList.add("bk-content");

        let title = document.createElement("h5");
        title.textContent = currentPiece.title;
    
        let author = document.createElement("cite");
        author.textContent = "Autor: " + currentPiece.author;

        let pieceText = document.createElement("p");
        pieceText.textContent = currentPiece.text;

        content.appendChild(title);
        content.appendChild(author);
        content.appendChild(pieceText);
        document.getElementById("newPage").appendChild(content);
    
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

    function showTab(currentTab) {
        // This function will display the specified tab of the form
        let tabs = document.getElementsByClassName("tab");
        tabs[currentTab].style.display = "block";
        fixStepIndicator(currentTab)
      }
      
      function nextPrev(n) {
        // This function will figure out which tab to display
        let tabs = document.getElementsByClassName("tab");
        if (n == 1 && !validateForm()) return false;
        tabs[currentTab].style.display = "none";
        currentTab = currentTab + n;
        showTab(currentTab);
      }
      
      
      function validateForm() {
        // This function deals with validation of the form fields
        let currentInput; 
        let valid = true;
        let tabs = document.getElementsByClassName("tab");
        let inputs = tabs[currentTab].getElementsByClassName("requiredInput");
        // A loop that checks every input field in the current tab:
        for (currentInput = 0; currentInput < inputs.length; currentInput++) {
          if (inputs[currentInput].value == "") {
            inputs[currentInput].className += " invalid";
            valid = false;
          }
        }
        if (valid) {
          document.getElementsByClassName("step")[currentTab].className += " finish";
        }
        return valid; // return the valid status
      }
      
      function fixStepIndicator(currentTab) {
        // This function removes the "active" class of all steps
        let currentStep;
        let steps = document.getElementsByClassName("step");
        for (currentStep = 0; currentStep < steps.length; currentStep++) {
          steps[currentStep].className = steps[currentStep].className.replace(" active", "");
        }
        steps[currentTab].className += " active";
      }
    
});
