const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const maxRecords = 151
const limit = 10
let offset = 0;
let pokemonDetail = [] 

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}

function modalDetails(pokemons) {
    let cardDetails = document.querySelectorAll('.pokemon');
    let modalDetail = document.querySelector('.dv-modal');
    let pokeSelected;

    cardDetails.forEach(card => {
        card.addEventListener('click', (e) => {
            pokeSelected = e.currentTarget.getElementsByClassName('name')[0].innerText.toLowerCase();
            let filterPoke = pokemons.filter((pokemon) => pokemon.name === pokeSelected);            
            if(pokeSelected === filterPoke[0].name) {
                let detail = filterPoke[0];
                console.log(detail);
                let html = '';

                html += '<div class="modal modal-dialog modal-dialog-centered" id="'+ pokeSelected +'Modal" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">'
                html += '    <div>'
                html += `        <div class="modal-content ${detail.type}">`
                html += '           <div class="modal-header">'
                html += '               <h1 class="modal-title" id="staticBackdropLabel">'+ pokeSelected +' <span class="number"># '+ detail.number +'</span> </h1>'
                html += '               <button type="button" class="btn-close" data-bs-dismiss="modal"></button>'
                html += '           </div>'
                html += '            <div class="modal-body">'
                html += '               <div class="modal-body-detail">'
                    if(detail.types) {
                        detail.types.forEach(type => {
                            html += `<span class="type modal-type ${type} me-2">${type}</span>`
                        })
                    }
                html += '               </div>'
                html += `                   <img src="${detail.photo}" alt="${pokeSelected}" class="img-fluid">`
                html += '                   <div class="stats">'
                html += '        <ul>'
                if (detail.stats) {
                    detail.stats.map(stat => {
                        html += '<li>'
                        html += '    <div class="stat">'
                        html += `        <span class="stat-name">${stat.stat.name}: </span>`
                        html += `        <span class="base-stat">${stat.base_stat}</span>`
                        html += '    </div>'
                        html += `    <div class="rate">`
                        html += `       <div class="${stat.base_stat > 50 ? 'green' : 'red'}" style="width: ${stat.base_stat > 100 ? 100 : stat.base_stat}%"></div>`
                        html += `    </div>`
                        html += '</li>'
                    })
                }
                html += '                       </ul>'
                html += '                   </div>'
                html += '            </div>'
                html += '        </div>'
                html += '    </div>'
                html += '</div>'

                modalDetail.innerHTML = html;
                
                let modalElement = document.getElementById(`${pokeSelected}Modal`);
                if(modalElement) {
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                } else {
                    console.error(`Modal não encontrado para ${pokeSelected}`);
                }
            }
        })
    });
    
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
        pokemons.forEach(pokemon => pokemonDetail.push(pokemon));
        modalDetails(pokemonDetail)
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function openModal(mn) {
    let modal = document.getElementById(mn);

    if (typeof modal == 'undefined' || modal === null)
        return;

    modal.style.display = 'Block';
    document.body.style.overflow = 'hidden';
}

function closeModal(mn) {
    let modal = document.getElementById(mn);

    if (typeof modal == 'undefined' || modal === null)
        return;

    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}