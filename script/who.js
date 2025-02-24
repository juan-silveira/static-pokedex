
const whoForm = document.querySelector('#who-form');
const whoTry = document.querySelector('#who-try');
const whoNumber = document.querySelector('#who-number');
const whoName = document.querySelector('#who-name');
const whoImage = document.querySelector('#who-image');
const whoTopBar = document.querySelector('#who-top-bar');
const whoIs = document.querySelector('#who-is');
const tryAgain = document.querySelector('#try-again');
const whoResult = document.querySelector('#who-result');
const tipButton1 = document.querySelector('.tip-button-1');
const tipButton2 = document.querySelector('.tip-button-2');
const tipButton3 = document.querySelector('.tip-button-3');
const tipText1 = document.querySelector('.tip-text-1');
const tipText2 = document.querySelector('.tip-text-2');
const tipText3 = document.querySelector('.tip-text-3');

let whoData = "";

const fetchApi = async (pkmnName) => {
    // Joining Pokémon names that has more than one word
    pkmnNameApi = pkmnName.toString().toLowerCase().split(' ').join('-');

    const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + pkmnNameApi);

    if (response.status === 200) {
        whoData = await response.json();
        return whoData;
    }

    return false;
}

const checkEndGame = ({ target }) => {
    if (target.value.toString().toLowerCase().split(' ').join('-') === whoData.name) {
        whoTry.style.display = "none";
        whoImage.style.filter = "brightness(100%)";
        whoTopBar.style.display = "flex";
        whoIs.style.display = "none";
        tryAgain.style.display = "inline-block";
        return;
    }
}

const blockEnterSubmit = (event) => {
    if (event.which == 13) {
        event.preventDefault();
    }
}

const revealPokemon = () => {
    whoTry.style.display = "none";
    whoIs.style.display = "none";
    whoImage.style.filter = "brightness(100%)";
    whoTopBar.style.display = "flex";
    tryAgain.style.display = "inline-block";
    tipButton1.style.display = "none";
    tipButton2.style.display = "none";
    tipButton3.style.display = "none";
    tipText1.style.display = "none";
    tipText2.style.display = "none";
    tipText3.style.display = "none";
}

const revealTip1 = () => {
    tipButton1.setAttribute('disabled', '');
    tipText1.innerHTML = `<strong>Dica 1:</strong> A primeira letra é "${whoData.name.split("")[0].toUpperCase()}"`;
    tipText1.style.display = "block";
}

const revealTip2 = () => {
    tipButton2.setAttribute('disabled', '');
    tipText2.innerHTML = `<strong>Dica 2:</strong> O pokémon tem ${whoData.name.length} letras`;
    tipText2.style.display = "block";
}

const revealTip3 = () => {
    let len = whoData.name.length;
    let position = Math.floor(Math.random() * len) + 1;
    if(position == 1){
        position = position + 1;
    }
    let letter = whoData.name.split("")[position -1];
    tipButton3.setAttribute('disabled', '');
    tipText3.innerHTML = `<strong>Dica 3:</strong> A letra "${letter}" está na posição ${position} `;
    tipText3.style.display = "block";
}

const renderPokemon = async () => {

    const pokemon = Math.floor(Math.random() * 151) + 1;

    const pkmnData = await fetchApi(pokemon);

    // Sets pokemon name at the top of the page
    whoNumber.innerHTML = '#' + pkmnData.id.toString().padStart(3, '0');
    whoName.innerHTML = pkmnData.name.toString().replace('-', ' ');

    // Sets pokemon image
    whoImage.src = pkmnData.sprites.other["official-artwork"].front_default;
    whoImage.style.display = "block";
}

const resetGame = () => {
    location.reload();
}

window.onload = () => {
    renderPokemon();
}

whoTry.addEventListener('input', checkEndGame);
whoTry.addEventListener('keypress', blockEnterSubmit);
tryAgain.addEventListener('click', resetGame);
whoIs.addEventListener('click', revealPokemon);
tipButton1.addEventListener('click', revealTip1);
tipButton2.addEventListener('click', revealTip2);
tipButton3.addEventListener('click', revealTip3);
whoImage.addEventListener('contextmenu', event => event.preventDefault());
