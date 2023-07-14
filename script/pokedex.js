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
const statBar = document.querySelector('.stat-bar');
const statDesc = document.querySelectorAll('.stat-desc');

const statTNumber = document.querySelector('.stat-tnumber');
const statTotal = document.querySelector('.stat-total');
const barTOuter = document.querySelector('#bar-touter');
const barTInner = document.querySelector('#bar-tinner');
const barTBadge = document.querySelector('#bar-tbadge');

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

const fetchPkmnList = async () => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=905&offset=0');
  
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
    statTotal.style.color = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
    pokedex.style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
    controls.style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;

    // For debugging - Will be removed later on
    // console.log(pkmnData);

    // Sets pokemon name at the top of the page
    pokemonName.innerHTML = pkmnData.name.toString().replace('-', ' ');

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
    let total = 0;
    pkmnData.stats.forEach((s, i) => {

        total = total + +pkmnData.stats[i]["base_stat"];
        statNumber[i].innerHTML = s.base_stat.toString().padStart(3, '0');
        barInner[i].style.width = `${s.base_stat / 2.5}%`;
        barInner[i].style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
        barOuter[i].style.backgroundColor = `rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.3)`;
        statDesc[i].style.color = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;

    });
    statTNumber.innerHTML = total;
    barTInner.style.width = `${total / 7.2}%`;
    barTInner.style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
    barTOuter.style.backgroundColor = `rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.3)`;
}; 

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }
  
  const pkmnNames = [];
  
  /*initiate the autocomplete function on the "search" element, and pass along the countries array as possible autocomplete values:*/
  autocomplete(document.getElementById("search"), pkmnNames);

  window.onload = async () => {
    const pkmnData = await fetchPkmnList();
    pkmnData.results.forEach((s, i) => {
    pkmnNames.push(pkmnData.results[i].name.replace("-", " "));
  });
  }