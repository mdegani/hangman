
var hangman = (function () {

    var allLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "w", "x", "y", "z"];
    //this array will track the status of all of the letter
    //of the alphabet:
    var allLettersTracking = [];
    var targetWord = '';


    return {

        startGame:(function(){
        console.log("game started script going, expect new word");
        var targetWord = getWord();
        console.log('Word for the game: ' + targetWord);
        for (i = 0; i < allLetters.length; i++) {
            allLettersTracking.push({
                letter: allLetters[i],
                selectedStatus: -1
            });
        };
        //also, must reset the DOM elements here as part of startGame
    })
    }

})();




