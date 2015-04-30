/*
$(document).ready(function () {
    $.get("http://wordguessservice.azure-mobile.net/api/random/", function (data, status) {
        alert("Data: " + data[0].word + "\nStatus: " + status);
    });
});
*/


var hangman = (function () {

    var allLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
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
            document.getElementById("btnNewGame").className = "btn btn-default btn-block";

            document.getElementById("playControls").style.visibility = "visible";
            document.getElementById("progressBar").style.width = 0 + '%';

            //document.getElementById("remainingLetters").innerHTML = allLetters;
            document.getElementById("guessInput").placeholder = 'Type a letter: ' + allLetters;
            document.getElementById("badLetters").innerHTML = 'May I suggest a vowel?  They are free.';

            //Build target word object:

            //removed var keyword.  it was rescoped the variable, causing bug


            //targetWord = getWord();
            // relplace the "getWord(); function, which drew data from a file with an ajax call

            $(document).ready(
            function () {
                $.get("http://wordguessservice.azure-mobile.net/api/random/", function (data, status) {
                    targetWord = data[0].word;
                    console.log('Target word: ' + targetWord);
                    targetWordLetters = targetWord.split("");

                    targetWordObject = [];
                    for (var twl = 0; twl < targetWordLetters.length; twl++) {
                        targetWordObject.push(
                            {
                                position: twl,
                                letter: targetWordLetters[twl],
                                guessed: -1
                            });
                    }
                });
            });





            //Build alphabet object:
            allLettersTracking = [];
            for (i = 0; i < allLetters.length; i++) {
                allLettersTracking.push({
                    letter: allLetters[i],
                    selectedStatus: -1
                    //-1 = not selected, 1 = selected and correct, 2 = selected and incorrect
                });
            };
            hangman.targetReveal();

        }),
        guessLetter: (function () {
            document.getElementById("guessInputSubmit").className = "btn btn-default btn-block";

            latestGuess = document.getElementById("guessInput").value.toLowerCase();
            //find the letter in targetWordLetters
            if (targetWordLetters.indexOf(latestGuess) > -1) {

                //update the targetWordObject, reveal letter:
                function isMatch(letter) {
                    return letter.letter == latestGuess;
                }
                var filteredTargetWordObject = targetWordObject.filter(isMatch);

                var x;
                for (x in filteredTargetWordObject) {
                    filteredTargetWordObject[x].guessed = 1;
                }

                //update allLettersTracking so we know which letters are used.
                function isMatchLetter(letter) {
                    return letter.letter == latestGuess;
                }
                var filteredTargetLetterTracking = allLettersTracking.filter(isMatchLetter);
                var w;
                for (w in filteredTargetLetterTracking) {
                    filteredTargetLetterTracking[w].selectedStatus = 1;
                }

                hangman.targetReveal();

            } else {
                //update the targetWordObject
                //update allLettersTracking so we know which letters are used.

                //todo: these functions are repeated should be refactored
                function isMatchLetterIncorrect(letter) {
                    return letter.letter == latestGuess;
                }
                var filteredTargetLetterTracking = allLettersTracking.filter(isMatchLetterIncorrect);
                var w;
                for (w in filteredTargetLetterTracking) {
                    filteredTargetLetterTracking[w].selectedStatus = 2;
                }

            }
            //clear input, update score and alphabet info
            hangman.updateScore();

            //allLettersTracking.selectedStatus

            document.getElementById("guessInput").value = '';
            document.getElementById("guessInput").focus();

        }),

        updateScore: (function () {
            //create a list of all of the remaining letters of the alphabet and all of the bad guesses:
            var remainingLetters = [];
            var badLetters = [];

            for (i in allLettersTracking) {

                if (allLettersTracking[i].selectedStatus == -1) {
                    remainingLetters.push(allLettersTracking[i].letter);
                } else if (allLettersTracking[i].selectedStatus == 2) {
                    badLetters.push(allLettersTracking[i].letter);

                }
            }

            //we need to know if all of the letters have been guessed
            var allLettersGuessed = true;
            //assume true, we'll set it to false if there is at least one object
            //where guessed == -1.  What we really want to do is filter the array
            //to show only guessed and compare that to the legth of the array, but
            //this should do for now.

            var gameStatus = {

                lettersWrong: badLetters.length,
                gameOver: (badLetters.length > 9 ? true : false)
            };

            for (i in targetWordObject) {
                if (targetWordObject[i].guessed == -1) {
                    allLettersGuessed = false;
                }
            }

            if (allLettersGuessed == true) {
                alert("you win!");
                gameStatus.gameOver = true;
            }

            //badLetters.length will determin hangman graphic and if the game need to end because of too many incorrect guesses

            // list remaining and bad letters:
            //document.getElementById("remainingLetters").innerHTML = 'Remaining letters: ' + remainingLetters;
            document.getElementById("guessInput").placeholder = 'Type a letter: ' + remainingLetters;

            document.getElementById("badLetters").innerHTML = badLetters;


            if (gameStatus.gameOver) {
                //game over.  need to stop input (deactivate button), reset variables and dom elements and offer an option to start a
                //new game.
                //btnNewGame should be green
                alert('Game over!  The word was' + targetWord);
                allLettersTracking = [];
                targetWord = '';
                targetWordLetters = [];
                targetWordObject = [];
                latestGuess = '';
                document.getElementById("progressBar").style.width = 0 + '%';


                document.getElementById("playControls").style.visibility = "hidden";
                document.getElementById("btnNewGame").className = "btn btn-success btn-block";


            }
            else {

                document.getElementById("progressBar").style.width = Math.floor(gameStatus.lettersWrong / 9 * 100) + '%';

            }


        })
    }

})();

function readyToInput(){

        document.getElementById("guessInputSubmit").className = "btn btn-success btn-block";

    
}


//initiate first game:
hangman.startGame();



