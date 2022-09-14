const newGameContainer = document.querySelector('#inicio');
const startGameButton = document.querySelector('#iniciar-juego');
const gameContainer = document.querySelector('#game');
const newGameButton = document.querySelector('#juego-nuevo');
const categoryTitle = document.querySelector('#game h2');
const canvas = document.querySelector('canvas');
const lettersContainer = document.querySelector('#letter-container');
const wordContainer = document.querySelector('#word-container');
const resultContainer = document.querySelector('#result-container');
const addWordContainer = document.querySelector('#agregar-palabra');
const addWordButton = document.querySelector('#agregar-palabra-btn');
const giveUpButton = document.querySelector('#desistir');

// variables globales
let chosenWord = '';
let winCount = 0;
let loseCount = 0;

let categorias = {
    paises: ['mexico', 'colombia', 'argentina', 'alemania', 'francia', 'korea', 'india', 'egipto', 'sudafrica', 'australia'],
    animales: ['leon', 'ballena', 'aguila', 'perro', 'cocodrilo', 'jirafa', 'hipopotamo', 'zebra', 'elefante', 'jaguar'],
    frutas: ['pera', 'naranja', 'guayaba', 'mango', 'mandarina', 'manzana', 'platano', 'fresa', 'uva', 'kiwi'],
    libros: ['pera', 'naranja', 'guayaba', 'mango', 'mandarina', 'manzana', 'platano', 'fresa', 'uva', 'kiwi']
}

const getRandomCategory = (obj) => {
    let categories = Object.keys(obj);
    let randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return randomCategory;
}

const getRandomWord = (category) => {
    let selectedCategory = categorias[category];
    let word = selectedCategory[Math.floor(Math.random() * category.length)]
    return word;
}
const pushLetter = (e) => {
    // console.log(e.target.innerText);
    e.target.disabled = true;
    e.target.classList.add('disabled');
    let chars = chosenWord.split('');
    
    if (chars.includes(e.target.innerText)) {
        // si esta agregar a contador win y reemplazar el dash por la letra
        // console.log('Si esta')
        let dashes = document.querySelectorAll('.dashes');
        // console.log(dashes);
        chars.forEach((char, index) => {
            if (char == e.target.innerText) {
                dashes[index].innerText = char;
                winCount++;
            }
        })
        
        // console.log(winCount, ' es igua? ', chars.length);
        if (winCount == chars.length) {
            console.log('Ganaste')
            setTimeout(
                () => {
                    gameContainer.classList.add('hide');
                    resultContainer.classList.remove('hide')
                    resultContainer.innerHTML = `
                        <h3 class="result-win">Ganaste!!!</h3>
                        <div class="game-buttons">
                            <button class="btn-primario" onclick=startGame(event)>Juego nuevo</button>
                            <button class="btn-secundario" onclick=goToStart()>Inicio</button>
                        </div>`;
                }, 1500
            )
            
        }
        
    }else {
        // No esta.. agregar al contador lose y dibujar en canvas
        // console.log('No esta...')
        loseCount++
        drawMan(loseCount);
        if (loseCount == 6) {
            console.log('Perdiste')
            setTimeout(() => {
                handleLosing()
                }, 1500)
        }
        
    }
}
const createLetters = () => {
    for (let i = 65; i < 91; i++) {
        let button = document.createElement('button');
        button.classList.add('letters');
        button.innerText = String.fromCharCode(i);
        button.addEventListener('click', pushLetter);
        lettersContainer.append(button);
    }
}

const canvasCreator = () => {
    let pincel = canvas.getContext("2d");
    pincel.beginPath();
    pincel.strokeStyle = '#0A3871';
    pincel.lineWidth = 10;

    const drawLine = (fromX, fromY, toX, toY) => {
        pincel.moveTo(fromX, fromY);
        pincel.lineTo(toX, toY);
        pincel.stroke();
    }

    const initialDrawing = () => {
        pincel.clearRect(0, 0, pincel.canvas.width, pincel.canvas.height);
        drawLine(0, 298, 300, 298);
        drawLine(50, 300, 50, 15);
        drawLine(45, 15, 200, 15);
        drawLine(200, 10, 200, 70);
    }
    const head = () => {
        pincel.beginPath(),
        pincel.arc(200, 100, 35, 0, Math.PI * 2, true );
        pincel.stroke();
    }
    const body = () => {
        drawLine(200, 130, 200, 230);
    }
    const leftLeg = () => {
        drawLine(200, 225, 170, 260)
    }
    const rightLeg = () => {
        drawLine(200, 225, 230, 260)
    }
    const leftArm = () => {
        drawLine(200, 150, 170, 180)
    }
    const rightArm = () => {
        drawLine(200, 150, 230, 180)
    }

    return {initialDrawing, head, body, leftLeg, rightLeg, leftArm, rightArm};
}

const drawMan = (count) => {
    const { head, body, leftLeg, rightLeg, leftArm, rightArm } = canvasCreator();
    switch (count) {
        case 1:
            head();
            break;
        case 2:
            body();
            break;
        case 3:
            leftArm();
            break;
        case 4:
            rightArm();
            break;
        case 5:
            leftLeg();
            break;
        case 6:
            rightLeg();
            break;
        default:
            break;
    }
}
const goToStart = () => {
    resultContainer.classList.add('hide');
    addWordContainer.classList.add('hide');
    newGameContainer.classList.remove('hide');
    gameContainer.classList.add('hide');
}
const saveWord = (category) => {
    categorias[category].push(chosenWord.toLowerCase());
    console.log(categorias);
}
const startGame = (e) => {
    newGameContainer.classList.add('hide');
    gameContainer.classList.remove('hide');
    resultContainer.classList.add('hide');
    addWordContainer.classList.add('hide');
    resultContainer.innerHTML = '';
    lettersContainer.innerHTML = '';
    winCount = 0;
    loseCount = 0;
    console.log(e.target.innerText);
    if (e.target.innerText === 'Guardar y jugar') {
        chosenWord = document.querySelector('#input-word').value.toUpperCase();
        console.log(document.querySelector('#category-options').value);
        let category = document.querySelector('#category-options').value
        saveWord(category);
        categoryTitle.innerText = category;
    } else {
        let category = getRandomCategory(categorias);
        chosenWord = getRandomWord(category).toUpperCase();
        categoryTitle.innerText = category;
    }
    createLetters();
    let displayWord = chosenWord.replace(/[A-Z]/g, '<span class="dashes">_</span>');
    wordContainer.innerHTML = displayWord;
    const { initialDrawing } = canvasCreator();
    initialDrawing();
}

const handleLosing = () => {
    gameContainer.classList.add('hide');
                resultContainer.classList.remove('hide')
                resultContainer.innerHTML = `
                    <h3 class="result-lose">Perdiste!!!</h3>
                    <p>La palabra era <span> ${chosenWord} </span></p>
                    <div class="game-buttons">
                        <button class="btn-primario" onclick=startGame(event)>Juego nuevo</button>
                        <button class="btn-secundario" onclick=goToStart()>Inicio</button>
                    </div>
                    `
}

//Agregar palabra

const createCategoryOptions = () => {
    for (const category in categorias) {
        document.querySelector('#category-options').innerHTML += `<option>${category}</option>`
    }
}

const handleAddWord = () => {
    newGameContainer.classList.add('hide');
    addWordContainer.innerHTML = `
        <h2>Agrega una nueva palabra</h2>
        <label>Categoria:
            <select id="category-options">
            </select>
        </label>
        <input type="text" id="input-word">
        <div class="game-buttons">
            <button class="btn-primario" onclick=startGame(event)>Guardar y jugar</button>
            <button class="btn-secundario" onclick=goToStart()>Cancelar</button>
        </div>
    `
    addWordContainer.classList.remove('hide');
    createCategoryOptions();
    
}

// Eventos
startGameButton.addEventListener('click', startGame);
newGameButton.addEventListener('click', startGame);
addWordButton.addEventListener('click', handleAddWord);
giveUpButton.addEventListener('click', handleLosing);

