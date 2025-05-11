

function startLevel(difficulty) {

    const level = document.getElementById(difficulty)
    const cardsContainer = level.querySelector('.cards');
    const movesCounter =  level.querySelector('.moves-counter')
    const nextLevelBtn = level.querySelector('.next-level-btn');
    const tryAgainBtn = level.querySelector('.try-again-btn');
    const textVictory = level.querySelector('.text-victory')
    const textDefeat = level.querySelector('.text-defeat')

    let HPsLeft;
    let cardValues = [];
    let totalPairs;
    
const colors = [ 
    "#FFD1DC", "#B5EAD7", "#C7CEEA", "#E2F0CB", 
    "#FFDAC1", "#B2E2F1", "#F8C8DC", "#D5E6ED", 
    "#F3E6DD", "#D4A5C3", "#A8D8B9", "#FFE5B4" 
];

const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
    
    if (difficulty === 'levelEasyJS') {HPsLeft = 8; totalPairs = 6};
    if (difficulty === 'levelNormalJS') {HPsLeft =14; totalPairs = 9};
    if (difficulty === 'levelHardJS') {HPsLeft = 16; totalPairs = 12};

    movesCounter.textContent = `Жизней: ${HPsLeft}`;

    // Прочистка поля и перемешивание карточек
    resetCards(); 
    setupCardEvents();
    switchScreen(difficulty);

    function resetCards() {
        if (cardsContainer.classList.contains('cards-transparent')) {
            cardsContainer.classList.remove('cards-transparent')
            textVictory.classList.remove('text-lvl-ended-active')
            textDefeat.classList.remove('text-lvl-ended-active')
            if (difficulty != 'levelHardJS') nextLevelBtn.classList.remove('active');
            tryAgainBtn.classList.remove('active')
        }

        cardsContainer.innerHTML = '';

        const shuffledColors = shuffleArray(colors).slice(0, totalPairs)
        const shuffledValues = shuffleArray(values).slice(0, totalPairs)
         
        const cardsData = shuffledValues.map((value, index) => ({
            value: value,
            color: shuffledColors[index]
        }));

        const pairedCardsData = cardsData.flatMap(card => [card, { ...card }]);

        const finalCards = shuffleArray(pairedCardsData);
        finalCards.forEach(data => {
            const card = document.createElement('div')
            card.classList.add('card')
            card.dataset.color = data.color;
            card.dataset.value = data.value
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back" style="background-color: ${data.color}; background-image: url('./assets/imgs/${data.value}.png')">
                    </div>
                </div>
            `
            cardsContainer.appendChild(card)
        })
    }

    function setupCardEvents() {
        const cards = document.querySelectorAll('.card');
        let flipped = [];
        let lock = false;
        pairsFound = 0;
        cards.forEach(card => {
            card.addEventListener('click', () => {
                if (lock || card.classList.contains('flipped')) return;

                card.classList.add('flipped');
                flipped.push(card);

                if (flipped.length === 2) {
                    lock = true;
                    const [a, b] = flipped;
                    if (a.dataset.value === b.dataset.value) {
                        flipped = [];
                        lock = false;
                        pairsFound += 1;
                        if (pairsFound == totalPairs) victory();
                    } else {
                        setTimeout(() => {
                            a.classList.remove('flipped');
                            b.classList.remove('flipped');
                            flipped = [];
                            lock = false;
                            doDamage()
                            if (HPsLeft == 0) defeat();
                        }, 1000);
                    }
                }
            });
        });
    }

    function victory() {
        if (difficulty != 'levelHardJS') {
            nextLevelBtn.classList.add('slide-in');
            nextLevelBtn.classList.add('active');
            nextLevelBtn.addEventListener('animationend', () => {
                nextLevelBtn.classList.remove('slide-in');
            }, { once: true })
        }
        cardsContainer.classList.add('cards-transparent')

        textVictory.classList.add('text-lvl-ended-active')
    }

    function defeat() {
        tryAgainBtn.classList.add('slide-in');
        tryAgainBtn.classList.add('active');
        tryAgainBtn.addEventListener('animationend', () => {
            tryAgainBtn.classList.remove('slide-in');
        }, { once: true })

        cardsContainer.classList.add('cards-transparent')

        textDefeat.classList.add('text-lvl-ended-active')
    }

    function doDamage() {
        HPsLeft -= 1;
        movesCounter.textContent = `Жизней: ${HPsLeft}`;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// анимация смены экрана
function switchScreen(nextScreen) {

    const current = document.querySelector('.screen.active');
    const next = document.getElementById(`${nextScreen}`);

    current.classList.add('slide-out');
    current.addEventListener('animationend', () => {
        current.classList.remove('active', 'slide-out');
        next.classList.add('active', 'slide-in');

        next.addEventListener('animationend', () => {
            next.classList.remove('slide-in');
        }, { once: true });
    }, { once: true });
}