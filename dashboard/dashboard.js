document.getElementById('addImageButton').addEventListener('click', function() {
    const imageEntry = document.querySelector('.imageEntry').cloneNode(true);
    document.getElementById('imagesContainer').appendChild(imageEntry);
});

document.getElementById('addAnswerButton').addEventListener('click', function() {
    const answerEntry = document.querySelector('.answerEntry').cloneNode(true);
    document.getElementById('answersContainer').appendChild(answerEntry);
});

document.getElementById('sceneForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const sceneLevel = document.getElementById('sceneLevel').value;
    const sceneType = document.getElementById('sceneType').value;

    const backgroundFile = document.getElementById('backgroundSrc').files[0];
    const backgroundReader = new FileReader();

    backgroundReader.onload = function(e) {
        const backgroundSrc = `images/imagenes/${backgroundFile.name}`;

        const images = Array.from(document.querySelectorAll('.imageEntry')).map(entry => {
            const imageFile = entry.querySelector('.imageSrc').files[0];
            const imageReader = new FileReader();

            return new Promise((resolve) => {
                imageReader.onload = function(e) {
                    resolve({
                        src: `images/imagenes/${imageFile.name}`,
                        x: parseInt(entry.querySelector('.imageX').value),
                        y: parseInt(entry.querySelector('.imageY').value),
                        width: parseInt(entry.querySelector('.imageWidth').value),
                        height: parseInt(entry.querySelector('.imageHeight').value),
                        direction: entry.querySelector('.imageDirection').value,
                        speed: parseInt(entry.querySelector('.imageSpeed').value)
                    });
                };
                imageReader.readAsDataURL(imageFile);
            });
        });

        Promise.all(images).then(async imagesData => {
            const questionText = document.getElementById('questionText').value;
            const answers = Array.from(document.querySelectorAll('.answerEntry')).map(entry => ({
                text: entry.querySelector('.answerText').value,
                value: entry.querySelector('.answerValue').value
            }));

            const sceneData = {
                background: { src: backgroundSrc },
                images: imagesData,
                question: { text: questionText, answers: answers }
            };

            const jsonOutput = JSON.stringify(sceneData, null, 2);
            document.getElementById('jsonOutput').textContent = jsonOutput;

            try {
                const handle = await window.showDirectoryPicker();
                const fileHandle = await handle.getFileHandle(`Nivel${sceneLevel}_${sceneType}.json`, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(jsonOutput);
                await writable.close();
                alert('JSON file created successfully in the selected directory.');
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to create JSON file.');
            }
        });
    };

    backgroundReader.readAsDataURL(backgroundFile);
});
