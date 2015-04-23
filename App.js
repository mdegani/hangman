

var hangman = (function () {

    var hangedGuy = "__<br/>|  | <br/> o <br/>-|- <br/> /\\"
    document.getElementById("hangedGuy").innerHTML = hangedGuy;

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
            document.getElementById("badLetters").innerHTML = 'Incorrect guesses: none so far.  May I suggest a vowel?  They are free.';
            document.getElementById("gameScore").innerHTML = '';

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

            //we need to know if all of the letters have been guessed
            var allLettersGuessed = true;
            //assume true, we'll set it to false if there is at least one object
            //where guessed == -1.  What we really want to do is filter the array
            //to show only guessed and compare that to the legth of the array, but
            //this should do for now.

            for (i in targetWordObject) {
                if (targetWordObject[i].guessed == -1) {
                    allLettersGuessed = false;
                }
            }

            if (allLettersGuessed == true) {
                alert("you win!");
            }

            //badLetters.length will determin hangman graphic and if the game need to end because of too many incorrect guesses

            // list remaining and bad letters:
            document.getElementById("remainingLetters").innerHTML = 'Remaining letters: ' + remainingLetters;
            document.getElementById("badLetters").innerHTML = 'Incorrect guesses: ' + badLetters;

            var gameStatus = {

                lettersWrong: badLetters.length,
                gameOver: (badLetters.length > 9 ? true : false)
            };
            if (gameStatus.gameOver) {
                //game over.  need to stop input (deactivate button), reset variables and dom elements and offer an option to start a
                //new game.
                document.getElementById("gameScore").innerHTML = 'Game over!  The word was <strong>' + targetWord + '</strong>.';
                allLettersTracking = [];
                targetWord = '';
                targetWordLetters = [];
                targetWordObject = [];
                latestGuess = '';

                document.getElementById("guessInputSubmit").disabled = true;

            }
            else {
                var hangmanGraphic = '(' + gameStatus.lettersWrong + '/9) ' + Array(gameStatus.lettersWrong + 1).join("*") + Array(9 - gameStatus.lettersWrong + 1).join("-")  //temporary use simple text "progress bar" (may use case statement later)
                document.getElementById("gameScore").innerHTML = hangmanGraphic;
            }


        })
    }

})();


//initiate first game:
hangman.startGame();



