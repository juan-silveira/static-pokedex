const search = document.querySelector('#search');
const form = document.querySelector('.form');
const number = document.querySelector('#number');
const pokemonName = document.querySelector('#pokemon-name');
const pokemonImage = document.querySelector('#pokemon-image');
const types = document.querySelector('#types');
const statNumber = document.querySelectorAll('.stat-number');
const statWeight = document.querySelector('#weight');
const statHeight = document.querySelector('#height');
const statBmi = document.querySelector('.stat-bmi');
const barInner = document.querySelectorAll('.bar-inner');
const barOuter = document.querySelectorAll('.bar-outer');
const barBadge = document.querySelectorAll('.bar-badge');
const statDesc = document.querySelectorAll('.stat-desc');
const baseStats = document.querySelector('#base-stats');
const pokedex = document.querySelector('#pokedex');
const controls = document.querySelector('#controls');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 0;

const typeColors = {
    "rock": [182, 158, 49],
    "ghost": [112, 85, 155],
    "steel": [183, 185, 208],
    "water": [100, 147, 235],
    "grass": [116, 203, 72],
    "psychic": [251, 85, 132],
    "ice": [154, 214, 223],
    "dark": [117, 87, 76],
    "fairy": [230, 158, 172],
    "normal": [170, 166, 127],
    "fighting": [193, 34, 57],
    "flying": [168, 145, 236],
    "poison": [164, 62, 158],
    "ground": [222, 193, 107],
    "bug": [167, 183, 35],
    "fire": [245, 125, 49],
    "electric": [249, 207, 48],
    "dragon": [112, 55, 255]
}

const fetchApi = async (pkmnName) => {
    // Joining Pokémon names that has more than one word
    pkmnNameApi = pkmnName.toString().toLowerCase().split(' ').join('-');

    const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + pkmnNameApi);

    if (response.status === 200) {
        const pkmnData = await response.json();
        return pkmnData;
    }

    return false;
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(search.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
        document.getElementById('search').value = '';
    }
});

buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
    document.getElementById('search').value = '';
});

const showSnackbar = () => {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    setTimeout(function () { location.reload(); }, 3000);
}

const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = 'Loading...';
    number.innerHTML = '';

    const pkmnData = await fetchApi(pokemon);

    // Validation when Pokémon does not exist
    if (!pkmnData) {
        showSnackbar();
        return;
    }

    // Variable receives this pokemon id
    searchPokemon = pkmnData.id;

    // Main Pokémon color, in order to change UI theme
    const mainColor = typeColors[pkmnData.types[0].type.name];

    statBmi.style.color = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
    baseStats.style.color = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
    pokedex.style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
    controls.style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;

    // For debugging - Will be removed later on
    // console.log(pkmnData);

    // Sets pokemon name at the top of the page
    pokemonName.innerHTML = pkmnData.name.toString();

    // Sets pokemon # at the top of the page
    number.innerHTML = '#' + pkmnData.id.toString().padStart(3, '0');

    // Sets pokemon image
    pokemonImage.src = pkmnData.sprites.other.home.front_default;

    // Sets pokemon weight 
    statWeight.innerHTML = (pkmnData.weight / 10).toString();

    // Sets pokemon height
    statHeight.innerHTML = (pkmnData.height / 10).toString();

    // Updates "Type" bubbles
    types.innerHTML = '';

    pkmnData.types.forEach((t) => {
        let newType = document.createElement('span');
        let type = t.type.name;
        let color = typeColors[t.type.name];

        switch (type) {
            case "rock":
                type = "pedra"
                break;
            case "ghost":
                type = "fantasma"
                break;
            case "steel":
                type = "aço"
                break;
            case "water":
                type = "água"
                break;
            case "grass":
                type = "grama"
                break;
            case "psychic":
                type = "psíquico"
                break;
            case "ice":
                type = "gelo"
                break;
            case "dark":
                type = "sombrio"
                break;
            case "fairy":
                type = "fada"
                break;
            case "fighting":
                type = "lutador"
                break;
            case "flying":
                type = "voador"
                break;
            case "poison":
                type = "veneno"
                break;
            case "ground":
                type = "terrestre"
                break;
            case "bug":
                type = "inseto"
                break;
            case "fire":
                type = "fogo"
                break;
            case "electric":
                type = "elétrico"
                break;
            case "dragon":
                type = "dragão"
                break;
            default:
                type = "normal"
                break;
        }

        newType.innerHTML = type;
        newType.classList.add('type');
        newType.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

        types.appendChild(newType);
    });

    // Updates Stats and Stats bars
    pkmnData.stats.forEach((s, i) => {
        statNumber[i].innerHTML = s.base_stat.toString().padStart(3, '0');
        barInner[i].style.width = `${s.base_stat / 1.5}%`;
        barInner[i].style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
        barOuter[i].style.backgroundColor = `rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.3)`;
        statDesc[i].style.color = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
        if (s.base_stat > 150) {
            barBadge[i].style.display = "flex";
            barBadge[i].innerHTML = 'MAX';
        } else {
            barBadge[i].style.display = "none";
        }

    });
};