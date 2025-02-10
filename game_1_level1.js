window.onload = function() {
    startGame();
};

function startGame() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'images/Nivel1/Oceano/fondo_mar.png';
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        addGameImages(ctx, canvas, img);
    };

    canvas.style.display = 'block';
    setTimeout(function() {
        canvas.style.opacity = '1';
    }, 10);
}

function addGameImages(ctx, canvas, backgroundImg) {
    const images = [
        {
            "src": "images/Nivel1/Oceano/ballena.png",
            "x": -800,
            "y": 50,
            "width": 800,
            "height": 600,
            "direction": "right",
            "speed": 2
        },
        {
            "src": "images/Nivel1/Oceano/cangrejo.png",
            "x": -300,
            "y": 1900,
            "width": 300,
            "height": 250,
            "direction": "right",
            "speed": 2
        },
        {
            "src": "images/Nivel1/Oceano/pescado.png",
            "x": canvas.width,
            "y": 1000,
            "width": 350,
            "height": 350,
            "direction": "left",
            "speed": 4
        },
        {
            "src": "images/Nivel1/Oceano/medusa.png",
            "x": canvas.width,
            "y": 1500,
            "width": 450,
            "height": 450,
            "direction": "left",
            "speed": 2
        },
        {
            "src": "images/Nivel1/Oceano/perro.png",
            "x": -550,
            "y": 1620,
            "width": 550,
            "height": 550,
            "direction": "right",
            "speed": 3
        }
    ];

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
            }
        });
        requestAnimationFrame(draw);
    }
    images.forEach(image => image.visible = true);
    draw();
}
