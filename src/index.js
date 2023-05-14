import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;
const inputSearch = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputSearch.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  const name = inputSearch.value.trim();
  if (!name) {
    clear();
    return;
  }
  fetchCountries(name)
    .then(countries => {
      clear();
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        createCountryList(countries);
      } else if (countries.length === 1) {
        createCountryInfo(countries[0]);
      } 
    })
    .catch(error => {
      console.log(error);
      if (error.message === '404 Not Found') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
      else {
        Notiflix.Notify.failure('Oops, there was an error while fetching data');
      }
      });
}

function createCountryList(countries) {
  const countryListMarkup = countries
    .map(
      country =>
        `<li style="list-style-type:none;"><img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30">${country.name.official}</li>`
    )
    .join('');
  countryList.insertAdjacentHTML('beforeend', countryListMarkup);
}

function createCountryInfo(country) {
  const languages = Object.values(country.languages);
  const countryInfoMarkup = `<img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="200"><h2>${country.name.official}</h2><p><strong>Capital:</strong> ${country.capital}</p><p><strong>Population:</strong> ${country.population}</p><p><strong>Languages:</strong> ${languages}</p>`;
  countryInfo.insertAdjacentHTML('beforeend', countryInfoMarkup);
}

function clear() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
