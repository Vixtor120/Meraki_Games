window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const language = urlParams.get('lang') || 'es';
    startCountdown(language); // Uncommented countdown start
};

function startCountdown(language) {
    const countdownContainer = document.createElement('div');
    countdownContainer.className = 'countdown-container';
    document.body.appendChild(countdownContainer);

    let countdown = 4;
    countdownContainer.innerHTML = `<h1">${countdown}</h1>`;

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownContainer.innerHTML = `<h1>${countdown}</h1>`;
        } else {
            clearInterval(countdownInterval);
            countdownContainer.remove();
            startGame(language);
        }
    }, 1000);
}

function getRandomJson() {
    const jsonFiles = [
        '../json/Nivel1_Granja.json', 
        '../json/Nivel1_Oceano.json', 
        '../json/Nivel1_Selva.json',
        '../json/Nivel2_Oficina.json'
    ];
    const randomIndex = Math.floor(Math.random() * jsonFiles.length);
    return jsonFiles[randomIndex];
}

function startGame(language) {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const jsonFile = getRandomJson();
    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            const backgroundImg = new Image();
            backgroundImg.src = data.background.src;
            backgroundImg.onload = function() {
                canvas.width = backgroundImg.width;
                canvas.height = backgroundImg.height;
                ctx.drawImage(backgroundImg, 0, 0);
                addGameImages(ctx, canvas, backgroundImg, data.images, language, jsonFile);
            };
        });

    canvas.style.display = 'block';
    setTimeout(function() {
        canvas.style.opacity = '1';
    }, 10);
}

function addGameImages(ctx, canvas, backgroundImg, images, language, jsonFile) {
    const loadedImages = images.map(image => {
        const img = new Image();
        img.src = image.src;
        return { img, ...image };
    });

    loadedImages.forEach(image => {
        image.img.onload = function() {
            animateImages(ctx, loadedImages, canvas, backgroundImg, language, jsonFile);
        };
    });
}

function animateImages(ctx, images, canvas, backgroundImg, language, jsonFile) {
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
        let allGone = true;
        images.forEach(image => {
            if (image.visible) {
                ctx.drawImage(image.img, image.x, image.y, image.width, image.height);
                if (image.direction === 'right') {
                    image.x += image.speed;
                    if (image.x > canvas.width) {
                        image.visible = false;
                    }
                } else {
                    image.x -= image.speed;
                    if (image.x < -image.width) {
                        image.visible = false;
                    }
                }
                allGone = false;
            }
        });
        if (allGone) {
            fetch(jsonFile)
                .then(response => response.json())
                .then(data => showQuestion(data.questions, language));
        } else {
            requestAnimationFrame(draw);
        }
    }
    images.forEach(image => image.visible = true);
    draw();
}

function showQuestion(questionData, language) {
    const question = questionData[language];
    if (!document.querySelector('.question-container')) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';
        questionDiv.innerHTML = `
            <h2>${question.text}</h2>
            <hr>
            <br>
            ${question.answers.map(answer => `
                <button class="answer-button" data-answer="${answer.value}">${answer.text}</button>
            `).join('')}
        `;
        document.body.appendChild(questionDiv);

        const answerButtons = document.querySelectorAll('.answer-button');
        answerButtons.forEach(button => {
            button.addEventListener('click', function() {
                questionDiv.remove();
                document.querySelector('canvas').remove();
            });
        });
    }
}