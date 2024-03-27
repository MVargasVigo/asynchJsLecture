'use strict';
const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const card = `<article class="country ${className}">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
          <h3 class="country__name">${data.name}</h3>
          <h4 class="country__region"${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            +data.population / 1000000
          ).toFixed(1)}M people</p>
          <p class="country__row"><span>🗣️</span>${
            data.languages.at(0).name
          }</p>
          <p class="country__row"><span>💰</span>${
            data.currencies.at(0).name
          }</p>
        </div>
        </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', card);
  countriesContainer.style.opacity = 1;
};

///////////////////////////////////////
const getCountryData = function (country) {
  //Country 1
  fetch(`https://restcountries.com/v2/name/${country}`)
    //the then method does something if a promise gets fulfilled and returns the value of the fulfilled promise
    .then(
      response => response.json() //this json method is available on all response objects coming from a fetch value. It will read the response and return a new promise, so we can chain another then method to this returned promise.
    )
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];
      //Country 2
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`); //This new fetch has to be read again by the response.json method. In order to avoid callback hell, we need to do the then method OUTSIDE of the current then method.
    })
    .then(response => response.json())
    .then(data => renderCountry(data, 'neighbour'));
};

getCountryData('peru');
