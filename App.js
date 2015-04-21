
var hangman = (function () {

    var allLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "w", "x", "y", "z"];
    //this array will track the status of all of the letter
    //of the alphabet:
    var allLettersTracking = [];
    var targetWord = '';
    var targetWordLetters = [];
    var targetWordObject = [];
    var latestGuess = '';

    return {
        targetReveal: (

       function () {
           var revealText = '';
           for (var reveal in targetWordObject) {
               if (targetWordObject[reveal].guessed == 1) {
                   revealText += ' ' + targetWordObject[reveal].letter + ' ';
               } else {
                   revealText += " _ ";
               }
               document.getElementById("targetWordReveal").innerHTML = revealText;
           }
       }),

        startGame: (function () {
            //Build target word object:
            var targetWord = getWord();
            console.log('Target word: ' + targetWord);
            targetWordLetters = targetWord.split("");
            console.log(targetWordLetters);
            for (var twl = 0; twl < targetWordLetters.length; twl++) {
                targetWordObject.push(
                {
                    position: twl,
                    letter: targetWordLetters[twl],
                    guessed: -1
                });
            }
            console.log(targetWordObject);

            //Build alphabet object:
            for (i = 0; i < allLetters.length; i++) {
                allLettersTracking.push({
                    letter: allLetters[i],
                    selectedStatus: -1
                });
            };
            hangman.targetReveal();

        }),
        guessLetter: (function () {
            latestGuess = document.getElementById("guessInput").value;
            //find the letter in targetWordLetters
            if(targetWordLetters.indexOf(latestGuess)>-1){
                console.log("Guessed a letter");
                //update the targetWordObject, reveal letter
            }else{
                console.log("Incorrect guess");
                //update the targetWordObject
            }
            //clear input, update score and alphabet info 
        })
    }

})();




