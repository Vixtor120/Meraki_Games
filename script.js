document.getElementById('playButton').addEventListener('click', function() {
    document.querySelector('h1').style.opacity = '0';
    document.querySelector('h1').style.transform = 'scale(0.9)';
    document.getElementById('playButton').style.opacity = '0';
    document.getElementById('playButton').style.transform = 'scale(0.9)';
    
    setTimeout(function() {
        document.querySelector('h1').style.display = 'none';
        document.getElementById('playButton').style.display = 'none';
        
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = 'images/Nivel1/Oceano/fondo_mar.png';
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        
        canvas.style.display = 'block';
        setTimeout(function() {
            canvas.style.opacity = '1';
        }, 10);
    }, 1000);
});
