const themeChanger = document.querySelector('.theme-changer')
const countriesContainer = document.querySelector('.countries-container')
const filterByRegion = document.querySelector('.filter-by-region')
const searchInput = document.querySelector('.search-container input')
/*---country search js--*/
const countryName = new URLSearchParams(location.search).get('name')
const flagImage = document.querySelector('.country-details img')
const countryNameH1 = document.querySelector('.country-details h1')
const nativeName = document.querySelector('.native-name')
const population = document.querySelector('.population')
const region = document.querySelector('.region')
const subRegion = document.querySelector('.sub-region')
const capital = document.querySelector('.capital')
const topLevelDomain = document.querySelector('.top-level-domain')
const currencies = document.querySelector('.currencies')
const languages = document.querySelector('.languages')
const borderCountries = document.querySelector('.border-countries')
/*--end country search----*/

themeChanger.addEventListener('click', () => {
    document.body.classList.toggle('dark');
})

let allCountriesData

fetch('https://restcountries.com/v3.1/all')
    .then((res) => res.json())
    .then((data) => {
        renderCountries(data)
        allCountriesData = data
    })

filterByRegion.addEventListener('change', (e) => {
    fetch(`https://restcountries.com/v3.1/region/${filterByRegion.value}`)
        .then((res) => res.json())
        .then(renderCountries)
})

function renderCountries(data) {
    countriesContainer.innerHTML = ''
    data.map((country) => {
        // console.log(country);
        const countryCard = document.createElement('a')
        countryCard.classList.add('country-card')
        countryCard.href = `../rest-country-search/country.html?name=${country.name.common}`
        countryCard.innerHTML = `
            <img src="${country.flags.svg}" alt="flag" />
            <div class="card-text">
                <h3 class="card-title">${country.name.common}</h3>
                <p><b>Population: </b>${country.population.toLocaleString('en-IN')}</p>
                <p><b>Region: </b>${country.region}</p>
                <p><b>Capital: </b>${country.capital?.[0]}</p>
            </div>
    `
        countriesContainer.append(countryCard)
    })
}

searchInput.addEventListener('input', (e) => {
    const filteredCountries = allCountriesData.filter((country) => country.name.common.toLowerCase().includes(e.target.value.toLowerCase()))
    renderCountries(filteredCountries)
})


/*-----*/
fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
    .then((res) => res.json())
    .then(([country]) => {
        flagImage.src = country.flags.svg
        countryNameH1.innerText = country.name.common
        population.innerText = country.population.toLocaleString('en-IN')
        region.innerText = country.region
        topLevelDomain.innerText = country.tld.join(', ')

        if (country.capital) {
            capital.innerText = country.capital?.[0]
        }

        if (country.subregion) {
            subRegion.innerText = country.subregion
        }

        if (country.name.nativeName) {
            nativeName.innerText = Object.values(country.name.nativeName)[0].common
        } else {
            nativeName.innerText = country.name.common
        }

        if (country.currencies) {
            currencies.innerText = Object.values(country.currencies)
                .map((currency) => currency.name)
                .join(', ')
        }

        if (country.languages) {
            languages.innerText = Object.values(country.languages).join(', ')
        }

        console.log(country);
        if (country.borders) {

            country.borders.forEach((border) => {
                fetch(`https://restcountries.com/v3.1/alpha/${border}`)
                    .then((res) => res.json())
                    .then(([borderCountry]) => {
                        // console.log(borderCountry)
                        const borderCountryTag = document.createElement('a')
                        borderCountryTag.innerText = borderCountry.name.common
                        borderCountryTag.href = `country.html?name=${borderCountry.name.common}`
                        borderCountries.append(borderCountryTag)
                    })
            })
        }
    })