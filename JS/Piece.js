const wordsPerPage = 500;

class Piece {

    constructor(title, text, genre, author = "Anonimo") {
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
        $('#pageCount').text(Math.ceil(this.words / wordsPerPage).toString());
    }
    
    capitalizeText() {
        let sentenceRegex = /.+?([\.\?\!\;]\s|$)/g;
        let capitalizedText = this.text.replace(sentenceRegex, function (sentence) {
            return sentence.charAt(0).toUpperCase() + sentence.substr(1).toLowerCase();
        });
        $('#capitalizedText').text(capitalizedText);
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

export default Piece;