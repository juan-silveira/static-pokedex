const nameBtn = document.querySelector('#nameBtn');
const resetRecordBtn = document.querySelector('#resetRecordBtn');
const resetGameBtn = document.querySelector('#resetGameBtn');
const resetGameModal = document.querySelector('#resetGameModal');

const resetName = () => {
    localStorage.removeItem('player');
    window.location = '../index.html';
}

const resetRecord = () => {
    localStorage.removeItem('record');
    location.reload(true);
}

const resetGame = () => {
    location.reload();
}

nameBtn.addEventListener('click', resetName);
resetRecordBtn.addEventListener('click', resetRecord);
resetGameBtn.addEventListener('click', resetGame);
resetGameModal.addEventListener('click', resetGame);