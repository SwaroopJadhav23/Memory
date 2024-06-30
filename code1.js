document.addEventListener('DOMContentLoaded', () => {
    const imageUrls = [
        'https://picsum.photos/100?image=0', 'https://picsum.photos/100?image=1', 'https://picsum.photos/100?image=2',
        'https://picsum.photos/100?image=3', 'https://picsum.photos/100?image=4', 'https://picsum.photos/100?image=5',
        'https://picsum.photos/100?image=6', 'https://picsum.photos/100?image=7', 'https://picsum.photos/100?image=8',
        'https://picsum.photos/100?image=9', 'https://picsum.photos/100?image=10', 'https://picsum.photos/100?image=11'
    ];

    // Duplicate images to create pairs
    let selectedImages = imageUrls.concat(imageUrls);

    // Array to store card IDs and track matches
    let cardIds = Array.from(Array(selectedImages.length).keys());
    let chosenCards = [];
    let matchedCards = [];

    const gameBoard = document.getElementById('gameBoard');
    const restartButton = document.getElementById('restartButton');
    const messageElement = document.getElementById('message');
    const timerElement = document.getElementById('timerDisplay'); // Timer display element

    let moves = 0;
    let timeLeft = 60;
    let timer;

    // Timer function
    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = formatTime(timeLeft);

            if (timeLeft === 0) {
                clearInterval(timer);
                showGameOverMessage("Game Over - Time's Up!");
            }
        }, 1000);
    }

    // Format time as mm:ss
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // Shuffle function
    function shuffleCards(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Create game board
    function createBoard() {
        gameBoard.innerHTML = '';
        shuffleCards(selectedImages);
        selectedImages.forEach((url, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.setAttribute('data-id', cardIds[index]);
            cardElement.innerHTML = `<img src="${url}" alt="Card Image">`;
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
    }

    // Flip card function
    function flipCard() {
        if (this.classList.contains('flipped') || this.classList.contains('matched')) return;

        const cardId = parseInt(this.getAttribute('data-id'));
        this.classList.add('flipped');
        chosenCards.push(cardId);

        if (chosenCards.length === 2) {
            setTimeout(checkForMatch, 1000);
        }
    }

    // Check for card match
    function checkForMatch() {
        const [cardOneId, cardTwoId] = chosenCards;
        const cardOne = document.querySelector(`.card[data-id="${cardOneId}"]`);
        const cardTwo = document.querySelector(`.card[data-id="${cardTwoId}"]`);

        if (selectedImages[cardOneId] === selectedImages[cardTwoId]) {
            cardOne.classList.add('matched');
            cardTwo.classList.add('matched');
            matchedCards.push(cardOneId, cardTwoId);
            moves++;
            checkGameWon();
        } else {
            setTimeout(() => {
                cardOne.classList.remove('flipped');
                cardTwo.classList.remove('flipped');
            }, 1000);
        }

        chosenCards = [];
    }

    // Check if game is won
    function checkGameWon() {
        if (matchedCards.length === selectedImages.length) {
            clearInterval(timer);
            showGameOverMessage("Congratulations! You've won!");
        }
    }

    // Show game over message
    function showGameOverMessage(message) {
        messageElement.textContent = message;
        messageElement.classList.remove('hidden');
    }

    // Restart game function
    function restartGame() {
        clearInterval(timer);
        timeLeft = 60;
        timerElement.textContent = formatTime(timeLeft);
        chosenCards = [];
        matchedCards = [];
        moves = 0;
        messageElement.classList.add('hidden');
        createBoard();
        startTimer();
    }

    // Restart button click event
    restartButton.addEventListener('click', restartGame);

    // Initialize game
    createBoard();
    startTimer();
});
