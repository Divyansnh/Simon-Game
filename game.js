$(document).ready(function() {
    const buttonColors = ['green', 'red', 'yellow', 'blue'];
    let gamePattern = [];
    let userClickedPattern = [];
    let level = 0;
    let highScore = 0;
    let started = false;
    let gameMode = 'classic';
    let isSoundOn = true;

    // Sound files
    const sounds = {
        green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
        red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
        yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
        blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
        wrong: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
    };

    // Start button
    $("#start-btn").click(function() {
        if (!started) {
            startGame();
        } else {
            resetGame();
        }
    });

    // Game mode button
    $("#mode-btn").click(function() {
        if (!started) {
            switch(gameMode) {
                case 'classic':
                    gameMode = 'speed';
                    break;
                case 'speed':
                    gameMode = 'reverse';
                    break;
                case 'reverse':
                    gameMode = 'classic';
                    break;
            }
            $(this).text("Mode: " + gameMode.charAt(0).toUpperCase() + gameMode.slice(1));
        }
    });

    // Sound toggle button
    $("#sound-btn").click(function() {
        isSoundOn = !isSoundOn;
        $(this).text("Sound: " + (isSoundOn ? "On" : "Off"));
    });

    // Help button
    $("#help-btn").click(function() {
        $("#modal").css("display", "block");
    });

    // Close modal
    $(".close").click(function() {
        $("#modal").css("display", "none");
    });

    // Close modal when clicking outside
    $(window).click(function(event) {
        if (event.target == $("#modal")[0]) {
            $("#modal").css("display", "none");
        }
    });

    // Game buttons
    $(".btn").click(function() {
        if (started) {
            const userChosenColor = $(this).attr("data-color");
            userClickedPattern.push(userChosenColor);
            playSound(userChosenColor);
            animatePress(userChosenColor);
            checkAnswer(userClickedPattern.length - 1);
        }
    });

    function startGame() {
        started = true;
        level = 0;
        gamePattern = [];
        $("#start-btn").text("Reset");
        nextSequence();
    }

    function resetGame() {
        started = false;
        level = 0;
        gamePattern = [];
        $("#start-btn").text("Start");
        $("#level").text("0");
    }

    function nextSequence() {
        userClickedPattern = [];
        level++;
        $("#level").text(level);

        const randomColor = buttonColors[Math.floor(Math.random() * 4)];
        gamePattern.push(randomColor);

        playSequence();
    }

    function playSequence() {
        let i = 0;
        const interval = (gameMode === 'speed') ? 300 : 1000;

        function playStep() {
            if (i < gamePattern.length) {
                const color = gamePattern[i];
                flashButton(color);
                playSound(color);
                i++;
                setTimeout(playStep, interval);
            }
        }

        if (gameMode === 'reverse') {
            gamePattern.slice().reverse().forEach((color, index) => {
                setTimeout(() => {
                    flashButton(color);
                    playSound(color);
                }, index * interval);
            });
        } else {
            playStep();
        }
    }

    function checkAnswer(currentLevel) {
        if (gameMode === 'reverse') {
            if (gamePattern[gamePattern.length - 1 - currentLevel] === userClickedPattern[currentLevel]) {
                if (userClickedPattern.length === gamePattern.length) {
                    setTimeout(nextSequence, 1000);
                }
            } else {
                gameOver();
            }
        } else {
            if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
                if (userClickedPattern.length === gamePattern.length) {
                    setTimeout(nextSequence, 1000);
                }
            } else {
                gameOver();
            }
        }
    }

    function gameOver() {
        playSound("wrong");
        $("body").addClass("game-over");
        $("#level").text("Game Over!");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);

        if (level > highScore) {
            highScore = level;
            $("#high-score").text(highScore);
        }

        resetGame();
    }

    function flashButton(color) {
        $(`[data-color='${color}']`).addClass("lit");
        setTimeout(() => {
            $(`[data-color='${color}']`).removeClass("lit");
        }, 250);
    }

    function animatePress(color) {
        $(`[data-color='${color}']`).addClass("pressed");
        setTimeout(() => {
            $(`[data-color='${color}']`).removeClass("pressed");
        }, 100);
    }

    function playSound(name) {
        if (isSoundOn) {
            sounds[name].currentTime = 0;
            sounds[name].play();
        }
    }
});