// Christian Matthews
// Javascript code for game


// Variables for kepping track of tries and score
var count = 0;
var triesRemainig = 25;

// Class with sounds
class AudioController {
    constructor() {
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.victorySound = new Audio('Assets/Audio/victory.wav');
        this.gameOverSound = new Audio('Assets/Audio/gameover.wav');
    }
    // These functions play sounds above when called
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.victorySound.play();
    }
    gameOver() {
        this.gameOverSound.play();
    }
}

// This is the class for the game
class MixOrMatch {
    constructor(cards) {
        // Creates an array with all the cards
        this.cardsArray = cards;
        // This is an instance of the AudioController class
        this.audioController = new AudioController();
    }

    // When called it does what is needed to start the game from the begining.
    startGame() {

        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        this.resetGame();

        // 500ms delay then set busy to false
        setTimeout(() => {
            this.busy = false;
        }, 500)
        
        this.hideCards();
    }

    // When game is over
    gameOver() {
        // Play gameover audio
        this.audioController.gameOver();
        // Show gameover screen
        document.getElementById('game-over-text').classList.add('visible');
    }

    // When you win
    victory() {
        // Play victory sound
        this.audioController.victory();
        // Show gameover screen
        document.getElementById('victory-text').classList.add('visible');
    }

    // Hides cards by remopving class names
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    // Flips card over
    flipCard(card) {
        
        // If canFlipCard returns true
        if(this.canFlipCard(card)) {

            // Play flip sound
            this.audioController.flip();

            // Add vcisible class to card which will flip the card over showing its face
            card.classList.add('visible');

            // This if and else statement checks if card flipped is a match
            // If cardToCheck is not null
            if(this.cardToCheck) {
                // Call checkCardMatch with card as parameter
                this.checkForCardMatch(card);
            } else {
                // If cardToCheck === null set it to card
                this.cardToCheck = card;
            }
        }
    }

    // Checks if t cards are a match
    checkForCardMatch(card) {
        // If cards are equal to each other
        if(this.getCardType(card) === this.getCardType(this.cardToCheck)) {

            // Call cardMatch with both cards
            this.cardMatch(card, this.cardToCheck);

        }
        else { 
            // If cards are not a match call cardMismatch with both cards
            this.cardMismatch(card, this.cardToCheck);

        }
    }

    // Function for when cards are a match
    cardMatch(card1, card2) {

        // Decrement tries remaining by 1
        triesRemainig -= 1;

        // Set card to check to null so that you can compare 2 more cards
        this.cardToCheck = null;

        // Push both cards into matchedCards array 
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);

        // Add matched class to both cards
        card1.classList.add('matched');
        card2.classList.add('matched');

        // Play matched sound
        this.audioController.match();

        // Increment count by 1
        count += 1;

        // Update flips and tries remaining on screen
        document.querySelector('#flips').textContent = count.toString();
        document.querySelector('#tries-remaining').textContent = triesRemainig.toString();

        // If count equals 8
        if(count === 8) {
            // You won call victory function
            this.victory();
        } else if (triesRemainig <= 5) {
            // If tries remaining gets to 5 change text color to red to warn player
            document.querySelector('#tries-remaining').style.color = "#f63004";

            // If triesRemaining equals 0
            if (triesRemainig === 0) {
                // You lost call gameOver function
                this.gameOver();
            }
        }
    }

    // Function for when cards are a mismatch
    cardMismatch(card1, card2) {

        // Decrement tries remaining by 1
        triesRemainig -= 1;

        // Set card to check to null so that you can compare 2 more cards
        this.cardToCheck = null;

        // Set bust to true
        this.busy = true;

        // Update tries remaining on screen
        document.querySelector('#tries-remaining').textContent = triesRemainig.toString();

        if (triesRemainig <= 5) {
            // If tries remaining gets to 5 change text color to red to warn player
            document.querySelector('#tries-remaining').style.color = "#f63004";

            // If triesRemaining equals 0
            if (triesRemainig === 0) {
                // You lost call gameOver function
                this.gameOver();
            }
        }
        // 1000ms delay before removiong visible class to flip both cards over and setting busy to false.
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    // To shuffle cards I use the Fisher and yates shuffle
    shuffleCards(cardsArray) {
        for (let i = cardsArray.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [cardsArray[i], cardsArray[randomIndex]] = [cardsArray[randomIndex], cardsArray[i]];
        }
        cardsArray = cardsArray.map((card, index) => {
            card.style.order = index;
        });
    }

    // This gets the name of the card that will later be used to compare 2 cards
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }

    // Can I flip a card? function
    canFlipCard(card) {
        // If this.busy is false and cardMatched array does not have card and card does not equal then return true
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck);
    }

    // Function to reset values
    resetGame() {
        count = 0;
        triesRemainig = 25;
        document.querySelector('#flips').textContent = count.toString();
        document.querySelector('#tries-remaining').textContent = triesRemainig.toString();
        document.querySelector('#tries-remaining').style.color = "black";
    }
}

// If page is loading
if (document.readyState === 'loading') {
    // Wait until page is loaded to call ready function
    document.addEventListener('DOMContentLoaded', ready)
} else {
    // Call ready funtion
    ready()
}

function ready() {

    // Puts all overlays into one array
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    // Puts all cards into one array
    let cards = Array.from(document.getElementsByClassName('card'));
    // Creates a new instance of MixOrMatch
    let game = new MixOrMatch(cards);

    // For each loop for each overlay
    overlays.forEach(overlay => {
        // Adds onclick event listener to overlay
        overlay.addEventListener('click', () => {
            // Remove visible class from overlay to stop showing it
            overlay.classList.remove('visible');
            // Call shuffleCards function
            game.shuffleCards(cards);
            // Call start game function
            game.startGame();
        });
    });

    // For each loop for each card
    cards.forEach(card => {
        // Adds onclick event listener to card
        card.addEventListener('click', () => {
            // Call flipCard function with card
            game.flipCard(card);
        });
    });
}