$(document).ready(function () {

    var hangman = (function () {

        var allLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        //this array will track the status of all of the letter
        //of the alphabet:
        var allLettersTracking = [];
        var targetWordObject = [];
        var latestGuess = '';
        var targetWord = ''; //we need this for dialog and stuff

        return {
            targetReveal: (function () {
                var revealText = ''
                for (var reveal in targetWordObject) {
                    if (targetWordObject[reveal].guessed == 1) {
                        revealText += ' ' + targetWordObject[reveal].letter + ' ';
                    } else {
                        revealText += " _ ";
                    }
                    $('#targetWordReveal').html(revealText);
                }
            }),
            startGame: (function () {
                $('#myModal').modal({ show: false })
                $("#pleaseWait").hide();
                $("#pleaseWait").fadeIn('slow');

                $.get("http://wordguessservice.azure-mobile.net/api/random/", function (data, status) {

                    $('#btnNewGame').attr('class', "btn btn-default btn-block");
                    $("#playControls").show();
                    $("#progressBar").css('width', 0 + '%');
                    $("#guessInput").attr('placeholder', 'Type a letter: ' + allLetters);
                    $("#badLetters").html('May I suggest a vowel?  They are free.');

                    //Build target word object

                    targetWord = data[0].word;

                    console.log('Target word: ' + data[0].word);

                    targetWordObject = [];

                    for (var twl = 0; twl < data[0].word.split("").length; twl++) {
                        targetWordObject.push(
                            {
                                position: twl,
                                letter: data[0].word.split("")[twl],
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
                    hangman.updateScore();
                    $("#pleaseWait").hide();


                });

            }),
            guessLetter: (function (latestGuess) {

                $('#guessInputSubmit').attr('class', 'btn btn-default btn-block');

                if (targetWord.split("").indexOf(latestGuess) > -1) {


                    $.each(targetWordObject, function (index, value) {
                        if (value.letter == latestGuess) {
                            value.guessed = 1;
                        }
                    });

                    $.each(allLettersTracking, function (index, value) {
                        if (value.letter == latestGuess) {
                            value.selectedStatus = 1;
                        }
                    });

                    hangman.targetReveal();

                } else {
                    //update the targetWordObject
                    //update allLettersTracking so we know which letters are used.

                    $.each(allLettersTracking, function (index, value) {
                        if (value.letter == latestGuess) {
                            value.selectedStatus = 2;
                        }
                    });

                }
                //clear input, update score and alphabet info
                hangman.updateScore();

                $('#guessInput').val('').focus();

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
                    gameOver: (badLetters.length > 9 ? true : false),
                    //nice nested if statement a la excel vlookup:
                    message: (badLetters.length > 9 ? 'You lost. ' : (badLetters.length == 0 ? 'Perfect game! ' : 'You win! ' + badLetters.length + ' wrong guesses.'))
                };

                for (i in targetWordObject) {
                    if (targetWordObject[i].guessed == -1) {
                        allLettersGuessed = false;
                    }
                }

                if (allLettersGuessed == true) {
                    gameStatus.gameOver = true;
                }

                // list remaining and bad letters:
                $("#guessInput").attr('placeholder', 'Type a letter: ' + remainingLetters);
                $('#badLetters').html(badLetters);

                if (gameStatus.gameOver) {
                    //game over.  need to stop input (deactivate button), reset variables and dom elements and offer an option to start a
                    //new game.
                    //btnNewGame should be green
                    $("#gameOverModal").html(gameStatus.message + ' The word was <em>' + targetWord + '</em>');
                    $('#myModal').modal('show');
                    allLettersTracking = [];
                    targetWord = '';
                    targetWordObject = [];
                    latestGuess = '';
                    $("#progressBar").css('width', 0 + '%');
                    $("#playControls").hide();
                    $('#btnNewGame').attr('class', "btn btn-success btn-block");
                    if ($("#badLetters").html() == '') {
                        $("#badLetters").html(gameStatus.message);
                    };

                }
                else {
                    $("#progressBar").css('width', Math.floor(gameStatus.lettersWrong / 9 * 100) + '%');
                }

            })
        }

    })();

    //initiate first game:
    hangman.startGame();

    $("#guessInput").focusin(function () {
        $('#guessInputSubmit').attr('class', 'btn btn-success btn-block');
    }).focusout(function () {
        $('#guessInputSubmit').attr('class', 'btn btn-default btn-block');
    });

    $("#guessInputSubmit").click(function () {
        hangman.guessLetter($('#guessInput').val().toLowerCase());
    });

    $("#btnNewGame").click(function () {
        hangman.startGame();
    });

});