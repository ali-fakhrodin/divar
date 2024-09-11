import { fetchAllCities, fetchPopularCities, getCityCookie, setCityCookie } from "./utils/cities.js"

const $ = document
const searchInp = document.querySelector('#search__inp')
const searchResultCitiesWrapper = document.querySelector('.search-result-cities')
const popularCitiesParent = $.querySelector('.main__cities-list .row')

let cities = null

const cityClickHandler = (e, city) => {
     e.preventDefault()
     window.location.href = `./main.html?city=${city}`
     setCityCookie(city)
}

window.cityClickHandler = cityClickHandler

const showPopularCities = (cities) => {
     cities.forEach(city => {
          popularCitiesParent.insertAdjacentHTML('beforeend', `
               <div class="col-2 d-flex justify-content-center">
                    <li class="main__cities-item">
                         <a class="main__cities-link" href="#" onClick="cityClickHandler(event, '${city.href}')">${city.name}</a>
                    </li>
               </div>
          `)
     });
}

const loadCityPosts = cityCookie => {
     if (cityCookie) {
          location.href = `./main.html?=${cityCookie}`
     }
}

const citySearchHandler = (e) => {
     // Close Search Results
     searchResultCitiesWrapper.classList.add('active')

     if (!searchInp.value || e.keyCode === 27) {
          searchResultCitiesWrapper.innerHTML = ''
          searchResultCitiesWrapper.classList.remove('active')
     }

     // Show Search Result
     const citySearchTitle = e.target.value
     const citiesResult = cities.filter(city => city.name.startsWith(citySearchTitle))

     if (citiesResult.length) {
          searchResultCitiesWrapper.innerHTML = ''
          citiesResult.forEach(city => {
               searchResultCitiesWrapper.insertAdjacentHTML('beforeend', `
                    <li>${city.name}</li>
               `)
          })
     } else {
          searchResultCitiesWrapper.innerHTML = "<li>نتیجه ای برای این جست و جو وجود ندارد!</li>"
     }
     console.log(citiesResult);

     console.log();
}

window.addEventListener('load', async () => {
     const popularCities = await fetchPopularCities()
     const cityCookie = getCityCookie();

     showPopularCities(popularCities)
     loadCityPosts(cityCookie)

     await fetchAllCities().then(res => cities = res)

     console.log(cities);

     // Search Handles
     searchInp.addEventListener('keyup', e => {
          citySearchHandler(e)
     })

     searchInp.addEventListener('blur', () => {
          searchResultCitiesWrapper.classList.remove('active')
     })
})