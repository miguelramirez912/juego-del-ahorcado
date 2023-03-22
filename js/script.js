import {canvasCreator, drawMan} from './canvas.js';

const newGameContainer = document.querySelector('#inicio');
const startGameButtons = document.querySelectorAll('.btn-primario');
const gameContainer = document.querySelector('#game');
const newGameButton = document.querySelector('#juego-nuevo');
const categoryTitle = document.querySelector('#game h2');
const lettersContainer = document.querySelector('#letter-container');
const wordContainer = document.querySelector('#word-container');
const resultContainer = document.querySelector('#result-container');
const addWordContainer = document.querySelector('#agregar-palabra');
const addWordButton = document.querySelector('#agregar-palabra-btn');
const giveUpButton = document.querySelector('#desistir');
const goToStartButton = document.querySelector("#btn-inicio");
const addWordErrorMsg = document.querySelector("#agregar-palabra-error");
const addWordForm = document.querySelector("#agregar-palabra-form");

// variables globales
let chosenWord = '';
let winCount = 0;
let loseCount = 0;
let categorias;

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
const pushLetter = (button) => {
    console.log("pushLetter ejecutado. Tecla oprimida: " + button.innerText);
    if (!button.disabled) {
        button.disabled = true;
        button.classList.add('disabled');
        let chars = chosenWord.split('');
        if (chars.includes(button.innerText)) {
            let dashes = document.querySelectorAll('.dashes');
            chars.forEach((char, index) => {
                if (char == button.innerText) {
                    dashes[index].innerText = char;
                    winCount++;
                }
            })
            if (winCount == chars.length) {
                setTimeout(
                    () => {
                        gameContainer.classList.add('hide');
                        resultContainer.classList.remove('hide');
                        const resultMessage = document.createElement("div");
                        resultMessage.innerHTML = `<h3 class="result-win">Ganaste!!!</h3>`;
                        resultMessage.setAttribute("id", "result-message");
                        const buttons = document.querySelector('#result-game-buttons');
                        buttons.insertAdjacentElement('beforebegin', resultMessage);

                    }, 1500
                );
            }
        }else {
            loseCount++
            drawMan(loseCount);
            if (loseCount == 6) {
                setTimeout(() => {
                    handleLosing()
                    }, 1500)
            }

        }
    }
    gameContainer.focus();
}

const createLetters = () => {
    for (let i = 65; i < 91; i++) {
        let button = document.createElement('button');
        button.classList.add('letters');
        button.innerText = String.fromCharCode(i);
        button.addEventListener('click', () => pushLetter(button));
        
        let timer;
        gameContainer.addEventListener('keydown', () => {
            console.log("Evento keydown disparado");
            if(button.innerText.charCodeAt(0) == event.keyCode){
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    pushLetter(button);
                }, 250);
            }
        });
        lettersContainer.append(button);
    }
}

const goToStart = (e) => {
    e.preventDefault();
    resultContainer.classList.add('hide');
    addWordContainer.classList.add('hide');
    newGameContainer.classList.remove('hide');
    gameContainer.classList.add('hide');
    addWordForm.reset();
    addWordErrorMsg.innerText = "";
}
const saveWord = (category) => {
    categorias[category].push(chosenWord.toLowerCase());
    setDataToLS(categorias);
    updateData();
}

const startGame = (e) => {
    newGameContainer.classList.add('hide');
    gameContainer.classList.remove('hide');
    resultContainer.classList.add('hide');
    addWordContainer.classList.add('hide');
    gameContainer.focus();
    const resultMessage = document.querySelector("#result-message");
    if(resultMessage){
        resultContainer.removeChild(resultMessage);
    }
    lettersContainer.innerHTML = '';
    winCount = 0;
    loseCount = 0;
    if (e.target.innerText === 'Guardar y jugar') {
        e.preventDefault();
        chosenWord = document.querySelector('#input-word').value.toUpperCase();
        let category = document.querySelector('#category-options').value
        saveWord(category.toLowerCase());
        categoryTitle.innerText = category;
    } else {
        let category = getRandomCategory(categorias);
        chosenWord = getRandomWord(category).toUpperCase();
        categoryTitle.innerText = category.toUpperCase();
    }
    createLetters();
    let displayWord = chosenWord.replace(/[A-Z]/g, '<span class="dashes">_</span>');
    wordContainer.innerHTML = displayWord;
    const { initialDrawing } = canvasCreator();
    initialDrawing();
}

const handleLosing = () => {
    gameContainer.classList.add('hide');
    resultContainer.classList.remove('hide');
    console.log(resultContainer);
    const resultMessage = document.createElement('div');
    resultMessage.setAttribute("id", "result-message");
    resultMessage.innerHTML = `<h3 class="result-lose">Perdiste!!!</h3>
         <p>La palabra era....<span> ${chosenWord} </span></p>
    `;
    const buttons = document.querySelector('#result-game-buttons');
    buttons.insertAdjacentElement('beforebegin', resultMessage);
}

// Obtener y guardar datos del Local Storage

const getDataFromLS = () => {
    const dataFromLS = JSON.parse(localStorage.getItem("hangmanCategories"));
    if (dataFromLS) {
        return dataFromLS;
    } else {
        return {
                paises: ['mexico', 'colombia', 'argentina', 'alemania', 'francia', 'korea', 'india', 'egipto', 'sudafrica', 'australia'],
                animales: ['leon', 'ballena', 'aguila', 'perro', 'cocodrilo', 'jirafa', 'hipopotamo', 'zebra', 'elefante', 'jaguar'],
                frutas: ['pera', 'naranja', 'guayaba', 'mango', 'mandarina', 'manzana', 'platano', 'fresa', 'uva', 'kiwi'],
            }
    }
}

const setDataToLS = (data) => {
    localStorage.setItem("hangmanCategories", JSON.stringify(data));
}

//Agregar palabra
const createCategoryOptions = () => {
    for (let category in categorias) {
        category = category[0].toUpperCase().concat(category.slice(1))
        document.querySelector('#category-options').innerHTML += `<option>${category}</option>`
    }
}

const validateNewWord = (newWord, category) => {

    if (!newWord || newWord.length < 3) {
        addWordErrorMsg.innerText = "Ingresa una palabra de almenos tres letras.";
        return false;
    }
    if (/\W+|_|\s/.test(newWord)) {
        addWordErrorMsg.innerText = "No debe tener caracteres especiales, ni acentos, ni espacios.";
        return false;
    }
    if (categorias[category].includes(newWord)) {
        addWordErrorMsg.innerText = "La palabra ya se encuentra en esta categoria.";
        return false;
    }
    return true;
}

const handleAddWord = () => {
    newGameContainer.classList.add('hide');
    addWordContainer.classList.remove('hide');
    createCategoryOptions();
    const inputWord = document.querySelector('#input-word');
    const saveWordBtn = document.querySelector("#guardar-palabra");
    saveWordBtn.disabled = true;
    saveWordBtn.classList.add("disabled-btn");
    const cancelBtn = document.querySelector("#cancelar-btn");
    cancelBtn.addEventListener("click", goToStart);
    addWordForm.addEventListener("input", () => {
        saveWordBtn.disabled = true;
        addWordErrorMsg.innerText = "";
        let newWord = inputWord.value.toLowerCase().trim();
        let categoryValue = document.querySelector("#category-options").value.toLowerCase();
        if (validateNewWord(newWord, categoryValue)) {
            saveWordBtn.disabled = false;
            saveWordBtn.classList.remove("disabled-btn");
        } else {
            saveWordBtn.disabled = true;
            saveWordBtn.classList.add("disabled-btn");
        }
    })
}



const updateData = () => {
    categorias = getDataFromLS();
    addWordForm.reset();
}

updateData();

// Eventos
startGameButtons.forEach(button => {
    button.addEventListener('click', startGame)
});
newGameButton.addEventListener('click', startGame);
addWordButton.addEventListener('click', handleAddWord);
giveUpButton.addEventListener('click', handleLosing);
goToStartButton.addEventListener('click', goToStart);

