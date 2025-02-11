document.getElementById('addImageButton').addEventListener('click', function() {
    const imageEntry = document.querySelector('.imageEntry').cloneNode(true);
    document.getElementById('imagesContainer').appendChild(imageEntry);
});

document.getElementById('addAnswerButtonEs').addEventListener('click', function() {
    const answerEntry = document.querySelector('.answerEntryEs').cloneNode(true);
    document.getElementById('answersContainerEs').appendChild(answerEntry);
});

document.getElementById('addAnswerButtonEn').addEventListener('click', function() {
    const answerEntry = document.querySelector('.answerEntryEn').cloneNode(true);
    document.getElementById('answersContainerEn').appendChild(answerEntry);
});

document.getElementById('addAnswerButtonCat').addEventListener('click', function() {
    const answerEntry = document.querySelector('.answerEntryCat').cloneNode(true);
    document.getElementById('answersContainerCat').appendChild(answerEntry);
});

document.getElementById('sceneForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const sceneLevel = document.getElementById('sceneLevel').value;
    const sceneType = document.getElementById('sceneType').value;

    const backgroundFile = document.getElementById('backgroundSrc').files[0];
    const backgroundReader = new FileReader();

    backgroundReader.onload = function(e) {
        const backgroundSrc = `../images/Nivel${sceneLevel}/${sceneType}/${backgroundFile.name}`;

        const images = Array.from(document.querySelectorAll('.imageEntry')).map(entry => {
            const imageFile = entry.querySelector('.imageSrc').files[0];
            const imageReader = new FileReader();

            return new Promise((resolve) => {
                imageReader.onload = function(e) {
                    resolve({
                        src: `../images/Nivel${sceneLevel}/${sceneType}/${imageFile.name}`,
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
            const questionTextEs = document.getElementById('questionTextEs').value;
            const answersEs = Array.from(document.querySelectorAll('.answerEntryEs')).map(entry => ({
                text: entry.querySelector('.answerTextEs').value,
                value: entry.querySelector('.answerValueEs').value
            }));

            const questionTextEn = document.getElementById('questionTextEn').value;
            const answersEn = Array.from(document.querySelectorAll('.answerEntryEn')).map(entry => ({
                text: entry.querySelector('.answerTextEn').value,
                value: entry.querySelector('.answerValueEn').value
            }));

            const questionTextCat = document.getElementById('questionTextCat').value;
            const answersCat = Array.from(document.querySelectorAll('.answerEntryCat')).map(entry => ({
                text: entry.querySelector('.answerTextCat').value,
                value: entry.querySelector('.answerValueCat').value
            }));

            const sceneData = {
                background: { src: backgroundSrc },
                images: imagesData,
                questions: {
                    es: { text: questionTextEs, answers: answersEs },
                    en: { text: questionTextEn, answers: answersEn },
                    cat: { text: questionTextCat, answers: answersCat }
                }
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
