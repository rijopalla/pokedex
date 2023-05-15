let pokemon_list = [];
const poke_container = document.getElementById("poke-container");
const poke_number = 750;
const search = document.getElementById("search");
const form = document.getElementById("searchform");

const cardCountElem = document.getElementById("card-count");
const cardTotalElem = document.getElementById("card-total");
const loader = document.getElementById("loader");
const cardIncrease = 10;
const cardLimit = poke_number;

cardTotalElem.innerHTML = cardLimit;

const pageCount = Math.ceil(cardLimit/cardIncrease);

let currentPage = 1;

const pokedex = document.getElementById("pokedex");
console.log(pokedex);

const fetchPokemon = () => {
    const promises = [];
    for (let i = 1; i <= poke_number; i++) {
        const api = `https://pokeapi.co/api/v2/pokemon/${i}`
        promises.push(fetch(api).then((res)=> res.json()));
    }

    Promise.all(promises).then(results => {
        const pokemon = results.map(data => ({
            name: data.name,
            id: data.id,
            image: data.sprites['front_default'],
            type: data.types.map((type) => type.type.name).join(', '),
            height: data.height    
        }));
        console.log(pokemon.height);
        displayPokemon(pokemon);
    });
};

const getRandomColor = () => {
    const h = Math.floor(Math.random() * 360);
    return `hsl(${h}deg, 75%, 85%)`;
};

const displayPokemon = (pokemon) => {
    const pokemonHTMLString = pokemon.map(poke => `
    <li class="card" onclick="selectPokemon(${poke.id})">
        <img class = "card-image" src="${poke.image}"/>
        <h2 class = "card-title">${poke.id}. ${poke.name}</h2>
        <p class = "card-subtitle"> Type: ${poke.type}</p>
    </li>
    `).join('');
    pokedex.innerHTML = pokemonHTMLString;
}

const selectPokemon = async(id) => {
    const api = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(api);
    const pokemon = await res.json();
    displayPopup(pokemon);
}

const displayPopup = (pokemon) => {
    console.log(pokemon);
    const type = pokemon.types.map(type => type.type.name).join(', ');
    const image = pokemon.sprites['front_default'];
    const ability = pokemon.abilities.map(abilities => abilities.ability.name).join(', ');
    const htmlString = `
        <div class="popup">
            <button id="closeBtn"
            onclick="closePopup()">Close
            </button>
            <div class="card">
                <img class = "card-image" src="${image}"/>
                <h2 class = "card-title">${pokemon.id}. ${pokemon.name}</h2>
                <p><small>Height: </small> ${pokemon.height} |
                <small> Weight: </small> ${pokemon.weight} |
                <small> Type: </small> ${type} | 
                <small> Ability: </small> ${ability}</p> 
            </div>
        </div>
    `;
    console.log(htmlString);
    pokedex.innerHTML = htmlString + pokedex.innerHTML;
}

const closePopup = () => {
    const popup = document.querySelector('.popup');
    popup.parentElement.removeChild(popup);
}

fetchPokemon();