const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const recordTime = document.querySelector('.record-time');
const recordPlayer = document.querySelector('.record-player');
const timer = document.querySelector('.timer');
const modalBodyP1 = document.querySelector('.modal-body-p1')
const modalBodyP2 = document.querySelector('.modal-body-p2')

// Get the modal
const modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
const closeModal = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

const characters = [];
const pkmnNames = [];

const populateArray = () => {
  let rNum = 0;
  for (let index = 0; index < 10; index++) {
    rNum = Math.floor(Math.random() * 150) + 1;
    if (!characters.includes(rNum)) {
      characters[index] = rNum;
    } else {
      index--
    }
  }
}

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

let firstCard = '';
let secondCard = '';

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');

  if (disabledCards.length === 20) {
    clearInterval(this.loop);
    localStorage.setItem('lastGameTime', +timer.innerHTML);
    var items = JSON.parse(localStorage.getItem('record'));
    if (!localStorage.getItem('record') || +timer.innerHTML < items.time) {
      localStorage.setItem('record', JSON.stringify({ "player": localStorage.getItem('player'), "time": +timer.innerHTML }));
    }
    modal.style.display = "block";
    modalBodyP1.innerHTML = `Parabéns ${localStorage.getItem('player')}!`;
    modalBodyP2.innerHTML = `Você concluiu o jogo em ${localStorage.getItem('lastGameTime')} segundos, tente bater o recorde.`;
  }
}

const checkRecord = () => {
  var items = JSON.parse(localStorage.getItem('record'));
  if (localStorage.getItem('record')) {
    recordTime.innerHTML = items.time;
    recordPlayer.innerHTML = `(${items.player})`;
  }
}

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter) {

    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');

    firstCard = '';
    secondCard = '';

    checkEndGame();

  } else {
    setTimeout(() => {

      firstCard.classList.remove('reveal-card');
      secondCard.classList.remove('reveal-card');

      firstCard = '';
      secondCard = '';

    }, 500);
  }

}

const revealCard = ({ target }) => {

  if (target.parentNode.className.includes('reveal-card')) {
    return;
  }

  if (firstCard === '') {

    target.parentNode.classList.add('reveal-card');
    firstCard = target.parentNode;

  } else if (secondCard === '') {

    target.parentNode.classList.add('reveal-card');
    secondCard = target.parentNode;

    checkCards();

  }
}

const fetchApi = async () => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0');

  if (response.status === 200) {
    const pkmnData = await response.json();
    return pkmnData;
  }

  return false;
}

const createCard = (character) => {

  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');
  const pkmnImage = createElement('img', 'pkmn-image')
  const pkmnName = createElement('p', 'pkmn-name')

  pkmnImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${character}.png`;
  pkmnName.innerHTML = pkmnNames[character - 1];

  card.appendChild(front);
  card.appendChild(back);
  front.appendChild(pkmnImage);
  front.appendChild(pkmnName);

  card.addEventListener('click', revealCard);
  card.setAttribute('data-character', character)

  return card;
}

const loadGame = async () => {
  populateArray();

  const pkmnData = await fetchApi();
  pkmnData.results.forEach((s, i) => {
    pkmnNames.push(pkmnData.results[i].name.replace("-", " "));
  });

  const duplicateCharacters = [...characters, ...characters];

  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });
}

const startTimer = () => {

  this.loop = setInterval(() => {
    const currentTime = +timer.innerHTML;
    timer.innerHTML = currentTime + 1;
  }, 1000);

}

window.onload = () => {
  spanPlayer.innerHTML = localStorage.getItem('player');
  checkRecord();
  startTimer();
  loadGame();
}
