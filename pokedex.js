const pokemonList = [];
const maxIndex = 250;
const search = document.getElementById('search-bar');

let initialItems = 10;
let loadItems = 10;

const pokedex = document.getElementById("pokedex");

const fetchPokemon = () => {
    const promises = [];
    for (let i = 1; i <= maxIndex; i++) {
        const api = `https://pokeapi.co/api/v2/pokemon/${i}`
        promises.push(fetch(api).then((res)=> res.json()));
    }

    Promise.all(promises).then(results => {
        let pokemon = results.map(data => ({
            name: data.name,
            id: data.id,
            image: data.sprites['front_default'],
            type: data.types.map((type) => type.type.name).join(', ')   
        }));
        displayPokemon(pokemon);
        pokemonList.push(pokemon);
    });
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


const getPokemon = async(id) => {
    const promises = [];
    const api = `https://pokeapi.co/api/v2/pokemon/${id}`
    promises.push(fetch(api).then((res)=> res.json()));
    Promise.all(promises).then(results => {
        let pokemon = results.map(data => ({
            name: data.name,
            id: data.id,
            image: data.sprites['front_default'],
            type: data.types.map((type) => type.type.name).join(', ')   
        }));
        displayPokemon(pokemon);
    });
}

const selectPokemon = async(id) => {
    const api = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const speciesapi = `https://pokeapi.co/api/v2/pokemon-species/${id}/`
    const res = await fetch(api);
    const res2 = await fetch(speciesapi);
    const pokemon = await res.json();
    const desc = await res2.json();
    showPopup(pokemon, desc);
}

const showPopup = (pokemon, desc) => {
    const description = desc.flavor_text_entries[1].flavor_text;
    const habitat = desc.habitat.name;
    const type = pokemon.types.map(type => type.type.name).join(', ');
    const image = pokemon.sprites['front_default'];
    const weakness = getWeakness(type);
    const ability = pokemon.abilities.map(abilities => abilities.ability.name).join(', ');
    const hpStat = pokemon.stats[0].base_stat;
    const attStat = pokemon.stats[1].base_stat;
    const defStat = pokemon.stats[2].base_stat;
    const spatkStat = pokemon.stats[3].base_stat;
    const spdefStat = pokemon.stats[4].base_stat;
    const spdStat = pokemon.stats[5].base_stat;
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
                <small> Ability: </small> ${ability} |
                <small> Habitat: </small> ${habitat}</p> 
                <ul> Base Stats: 
                    <li> HP: ${hpStat} </li>
                    <li> Attack: ${attStat} </li>
                    <li> Defense: ${defStat} </li>
                    <li> Special Attack: ${spatkStat} </li>
                    <li> Special Defense: ${spdefStat} </li>
                    <li> Speed: ${spdStat} </li>
                </ul>
                <p> Weaknesses: ${weakness}</p>
                <p> ${description} </p>
            </div>
        </div>
    `;
    pokedex.innerHTML = htmlString + pokedex.innerHTML;
}

const getWeakness = (type) => {
    const typeString = type.split(',');
    const weaknessList = [];
    typeString.forEach(type => {
        switch(type) {
            case "normal":
                weaknessList.push("rock, ghost, steel");
                break;
            case "fighting":
                weaknessList.push("flying, poison, psychic, bug, ghost, fairy");
                break;
            case "flying":
                weaknessList.push("rock, steel, electric");
                break;
            case "poison":
                weaknessList.push("poison, ground, rock, ghost, steel");
                break;
            case "ground":
                weaknessList.push("flying, bug, grass");
                break;
            case "rock":
                weaknessList.push("fighting, ground, steel, water, grass");
                break;
            case "bug":
                weaknessList.push("fighting, flying, poison, ghost, steel, fire, fairy");
                break;
            case "ghost":
                weaknessList.push("normal, dark, ghost");
                break;
            case "steel":
                weaknessList.push("steel, fire, water, electric");
                break;
            case "fire":
                weaknessList.push("rock, fire, water, dragon");
                break;
            case "water":
                weaknessList.push("water, grass, dragon");
                break;
            case "grass":
                weaknessList.push("flying, poison, bug, steel, fire, grass, dragon");
                break;
            case "electric":
                weaknessList.push("ground, grass, electric, dragon");
                break;
            case "psychic":
                weaknessList.push("steel, psychic, dark");
                break;
            case "ice":
                weaknessList.push("steel, fire, water, ice");
                break;
            case "dragon":
                weaknessList.push("steel, fairy");
                break;
            case "fairy":
                weaknessList.push("poison, steel, fire");
                break;
            case "dark":
                weaknessList.push("fighting, dark, fairy");
                break;
        }
    });
    return weaknessList.join(', ');
    
}
const closePopup = () => {
    const popup = document.querySelector('.popup');
    popup.parentElement.removeChild(popup);
}

fetchPokemon();

search.addEventListener('keyup', (e) => {
    e.preventDefault();

    const searchTarget = e.target.value.toLowerCase();
    console.log(searchTarget);
    const filteredPokemon = [];

    for (let j = 0; j < maxIndex; j++) {
        if (pokemonList[0][j].name.includes(searchTarget)){
            filteredPokemon.push(pokemonList[0][j].id);
        }
        else if (pokemonList[0][j].id === parseInt(searchTarget)) {
            filteredPokemon.push(pokemonList[0][j].id);
        }
    }
    getPokemon(filteredPokemon);
    console.log(filteredPokemon);
    if (searchTarget === "") {
        fetchPokemon();
    }
});
