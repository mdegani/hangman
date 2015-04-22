

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

            document.getElementById("guessInputSubmit").disabled = false;
            document.getElementById("remainingLetters").innerHTML = 'Remaining letters: ' + allLetters;
            document.getElementById("badLetters").innerHTML = 'Incorrect guesses: (0)';

            //Build target word object:

            //removed var keyword.  it was rescoped the variable, causing bug
            targetWord = getWord();
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

            //badLetters.length will determin hangman graphic and if the game need to end because of too many incorrect guesses



            // list remaining and bad letters:
            document.getElementById("remainingLetters").innerHTML = 'Remaining letters: ' + remainingLetters;
            document.getElementById("badLetters").innerHTML = 'Incorrect guesses: ' + badLetters + "(" + badLetters.length + ")";

            var gameStatus = {

                lettersWrong: badLetters.length,
                gameOver: (badLetters.length > 7 ? true : false)
            };
            if (gameStatus.gameOver) {
                //game over.  need to stop input (deactivate button), reset variables and dom elements and offer an option to start a
                //new game.
                document.getElementById("gameScore").innerHTML = 'Game over!  The word was <strong>' + targetWord + '</strong>.';
                /*var allLettersTracking = [];
                var targetWord = '';
                var targetWordLetters = [];
                var targetWordObject = [];
                var latestGuess = '';*/

                document.getElementById("guessInputSubmit").disabled = true;

            }
            else {
                var hangmanGraphic = '(' + gameStatus.lettersWrong + '/7) ' + Array(gameStatus.lettersWrong + 1).join("*") + Array(7 - gameStatus.lettersWrong + 1).join("-")  //temporary use simple text "progress bar" (may use case statement later)
                document.getElementById("gameScore").innerHTML = hangmanGraphic;
            }


        })
    }

})();


//initiate first game:
hangman.startGame();



