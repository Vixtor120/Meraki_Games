window.onload = function() {
    startGame();
};

function startGame() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    fetch('../json/oceano.json') // Update this path if necessary
        .then(response => response.json())
        .then(data => {
            const backgroundImg = new Image();
            backgroundImg.src = data.background.src;
            backgroundImg.onload = function() {
                canvas.width = backgroundImg.width;
                canvas.height = backgroundImg.height;
                ctx.drawImage(backgroundImg, 0, 0);
                addGameImages(ctx, canvas, backgroundImg, data.images);
            };
        });

    canvas.style.display = 'block';
    setTimeout(function() {
        canvas.style.opacity = '1';
    }, 10);
}

function addGameImages(ctx, canvas, backgroundImg, images) {
    const loadedImages = images.map(image => {
        const img = new Image();
        img.src = image.src;
        return { img, ...image };
    });

    loadedImages.forEach(image => {
        image.img.onload = function() {
            animateImages(ctx, loadedImages, canvas, backgroundImg);
        };
    });
}

function animateImages(ctx, images, canvas, backgroundImg) {
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
            fetch('../json/oceano.json') // Update this path if necessary
                .then(response => response.json())
                .then(data => showQuestion(data.question));
        } else {
            requestAnimationFrame(draw);
        }
    }
    images.forEach(image => image.visible = true);
    draw();
}

function showQuestion(questionData) {
    if (!document.querySelector('.question-container')) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';
        questionDiv.innerHTML = `
            <h2>${questionData.text}</h2>
            <hr>
            <br>
            ${questionData.answers.map(answer => `
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