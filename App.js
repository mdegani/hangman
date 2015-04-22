

var hangman = (function () {

    var allLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v","w", "x", "y", "z"];
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
            targetWordObject = [];
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
                console.log("Guessed a letter");

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

                console.log(allLettersTracking);

                hangman.targetReveal();

            } else {
                console.log("Incorrect guess");
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
                console.log(allLettersTracking);

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
                    console.log("Bad letter:" + allLettersTracking[i].letter)
                    badLetters.push(allLettersTracking[i].letter);

                }
            }

            //badLetters.length will determin hangman graphic and if the game need to end because of too many incorrect guesses



            // list remaining and bad letters:
            document.getElementById("remainingLetters").innerHTML = 'Remaining letters: ' + remainingLetters;
            document.getElementById("badLetters").innerHTML = 'Incorrect guesses: ' + badLetters + "("+ badLetters.length + ")";



            
        })
    }

})();


//initiate first game:
hangman.startGame();



