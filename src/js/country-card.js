'use strict'

export function createPreviousListCountry(cardInfo) {
    return cardInfo
        .map(
            ({ name: { official }, flags: { svg } }) => `
        <li class="country-info__img">
        <img src="${svg}" alt="${official}" width="20" height="20">           
            <p>${official}</p>
        </li>`
        )
        .join('')
}

export function createCardCountry({
    flags: { svg },
    name: { official },
    capital,
    population,
    languages,
}) {
    const languagesMore = Object.values(languages).join(', ');
    return `
    <div class="country-info__card">
        <div class="country-info__img">
        <img src="${svg}" alt="${official}" width="20" height="20">           
            <h2>${official}</h2>
        </div>
  		 <p><b>Capital:</b> ${capital}</p>
  		 <p><b>Population:</b> ${population}</p>
  		 <p><b>Languages:</b> ${languagesMore}</p>
    </div>`
}

export function cleanMarkupCountry(refEl) {
    return refEl.innerHTML = ''
}

