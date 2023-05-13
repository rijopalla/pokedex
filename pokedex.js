let pokemon_list = [];
const poke_container = document.getElementById("poke-container");
const url = "https://pokeapi.co/api/v2/pokemon/";
const poke_number = 300;
const search = document.getElementById("search");
const form = document.getElementById("searchform");

const fetchPokemon = async() => {
    for (let i = 1; i <= poke_number; i++) {
        await getAllPokemon(i);
    }
    pokemon_list.forEach((pokemon) => createPokemonCard(pokemon));
};

const removePokemon = () => {
    const pokemonEls = document.getElementsByClassName("pokemon");
    let removablePokemons = [];
    for (let i = 0; i < pokemonEls.length; i++) {
        const pokemonEl = pokemonEls[i];
        removablePokemons = [...removablePokemons, pokemonEl];
    }
    removablePokemons.forEach((remPoke) => remPoke.remove());
};

const getPokemon = async(id) => {
    const searchPokemon = pokemon_list.filter((pokemon) => pokemon.name === id);
    removePokemon();
    searchPokemon.forEach((pokemon) => createPokemonCard(pokemon));
};

const getAllPokemon = async(id) => {
    const res = await fetch(`${url}${id}/`);
    const pokemon = await res.json();
    pokemon_list = [...pokemon_list,pokemon];
};

fetchPokemon();

function createPokemonCard(pokemon){
    const pokemonEl = document.createElement("div");
    pokemonEl.classList.add("pokemon");
    const poke_types = pokemon.types.map((el) => el.type.name).slice(0,1);
    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const pokeInnerHTML = `<div class="img-container"> 
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png"/>
    </div>
    <div class="info">
    <span class="number">#${pokemon.id.toString().padStart(3,"0")}</span>
    <h3 class="name">${name}</h3>
    <small class="type"> <span>${poke_types}</span></small>
    </div>`
    pokemonEl.innerHTML = pokeInnerHTML;
    poke_container.appendChild(pokemonEl);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if (searchTerm) {
        getPokemon(searchTerm);
        search.value = "";
    } else if (searchTerm === "") {
        pokemon_list = [];
        removePokemon();
        fetchPokemon();
    }
});