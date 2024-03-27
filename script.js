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
  /* countriesContainer.style.opacity = 1; */ //Replaced at the finally method
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  /* countriesContainer.style.opacity = 1; */
};

const getJSON = function (url, errorMsg = 'Something went wrong') {
  fetch(url).then(response => {
    //the 'then' method does something if a promise gets fulfilled and returns the value of the fulfilled promise
    if (!response.ok) throw new Error(`${errorMsg}`); //This is a rejection to the promise that we have manually created. It let's us create custom error messages and it will skip all of the rest of the code until the catch method, where we handle errors.
    return response.json(); //this json method is available on all response objects coming from a fetch value. It will read the response and return a new promise, so we can chain another 'then' method to this returned promise.
  });
};

//The getJSON function will do the same as this block of code:
/* //Country 1
fetch(`https://restcountries.com/v2/name/${country}`)
.then(response => {
  if (!response.ok)
    throw new Error(`Country not found (${response.status})`); //This is a rejection to the promise that we have manually created. It let's us create custom error messages and it will skip all of the rest of the code until the catch method, where we handle errors.
  response.json(); //this json method is available on all response objects coming from a fetch value. It will read the response and return a new promise, so we can chain another then method to this returned promise.
}).then(data => {
      renderCountry(data[0]); This line we keep even with the getJSON function
      const neighbour = data[0].borders?.[0]; This line we keep even with the getJSON function
      //Country 2
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`); //This new fetch has to be read again by the response.json method. In order to avoid callback hell, we need to do the then method OUTSIDE of the current then method.
    })
    .then(response => response.json()) 
*/

///////////////////////////////////////
const getCountryData = function (country) {
  //Country 1
  getJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];
      if (!neighbour) throw new Error('No neighbour found');
      //Country 2
      return getJSON(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      renderError(`Something went wrong 🤯🤯 ${err.message}. Try again`);
    }) //We handle an error when the promise gets rejected by using the catch method. We can use this method at the end of the chain of any promise and it will work well
    .finally(() => {
      countriesContainer.style.opacity = 1;
    }); //The finally method gets called no matter what happens with the promise, it wil ALWYAYS be called
};

btn.addEventListener('click', function () {
  getCountryData('peru');
});

const whereAmI = function (lat, lng) {
  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
  )
    .then(response => {
      console.log(response); //This will help us see information on the response, like the ok property. If it is false we can throw an error like this:
      if (!response.ok)
        throw new Error(`Problem with geocoding ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.countryName}`);
      return fetch(`https://restcountries.com/v2/name/${data.countryName}`);
    })
    .then(response => {
      if (!response) throw new Error(`Country not found (${response.status})`);
      return response.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.log(`Something went wrong! ${err.message}`))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

whereAmI(52.508, 13.381);
