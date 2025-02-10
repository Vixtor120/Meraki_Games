document.getElementById('playButton').addEventListener('click', function() {
    document.querySelector('h1').style.opacity = '0';
    document.querySelector('h1').style.transform = 'scale(0.9)';
    document.getElementById('playButton').style.opacity = '0';
    document.getElementById('playButton').style.transform = 'scale(0.9)';

    setTimeout(function() {
        document.querySelector('h1').style.display = 'none';
        document.getElementById('playButton').style.display = 'none';
        
        const languageButtons = document.querySelector('.language-buttons');
        languageButtons.style.display = 'flex';
        setTimeout(() => {
            languageButtons.style.opacity = '1';
        }, 10);
    }, 1000);
});

const languageButtons = document.querySelectorAll('.language-button');
languageButtons.forEach(button => {
    button.addEventListener('click', function() {
        const language = this.dataset.language;
        const instructionsImage = document.querySelector('.instructions-image');
        instructionsImage.src = `images/Normas/${language}.png`;

        const languageButtonsContainer = document.querySelector('.language-buttons');
        languageButtonsContainer.classList.add('hidden');
        setTimeout(() => {
            languageButtonsContainer.style.display = 'none';
            instructionsImage.classList.add('visible');
        }, 500);

        const startGameButton = document.getElementById('startGameButton');
        startGameButton.style.display = 'block';
        
        if (language === 'es') {
            startGameButton.textContent = 'Jugar';
        } else if (language === 'en') {
            startGameButton.textContent = 'Play';
        } else if (language === 'cat') {
            startGameButton.textContent = 'Jugar';
        }
    });
});

document.getElementById('startGameButton').addEventListener('click', function() {
    window.location.href = 'game_1_level1.html';
});
