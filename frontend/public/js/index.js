import { getAllCities } from "../../utils/shared.js";
import { saveInLocalStorage } from "../../utils/utils.js";

const cityClickHandler = (cityName, cityID) => {
     location.href = './pages/posts.html'

     saveInLocalStorage('cities', [{ name: cityName, id: cityID }])
}

window.cityClickHandler = cityClickHandler

window.addEventListener("load", async () => {
     const citiesResponse = await getAllCities()
     const cities = await citiesResponse.data.cities
     const popularCitiesContainer = document.querySelector("#popular-cities");
     const searchInp = document.querySelector('#search-input')
     const searchResultWrapper = document.querySelector('.search-result-cities')

     // ُSearch
     searchInp.addEventListener('keyup', e => {
          searchResultWrapper.innerHTML = ''
          const searchValue = e.target.value
          const searchFilteredCities = cities.filter(city => city.name.startsWith(searchValue))
          searchResultWrapper.classList.add('active')

          if (!searchValue.length) {
               searchResultWrapper.classList.remove('active')
               return true
          }

          if (searchFilteredCities.length) {
               searchFilteredCities.forEach(city => {
                    searchResultWrapper.insertAdjacentHTML('beforeend', `
                         <li onclick="cityClickHandler('${city.name}', '${city.id}')">${city.name}</li>
                    `)
               })
          } else {
               searchResultWrapper.insertAdjacentHTML('beforeend', `
                    <li>نتیجه ای پیدا نشد!</li>
               `)
          }
     })

     searchInp.addEventListener('blur', () => {
          searchResultWrapper.classList.remove('active')
     })

     // Popular Cities
     const popularCities = cities.filter(city => city.popular);

     popularCities.forEach((city) => {
          popularCitiesContainer.insertAdjacentHTML(
               "beforeend",
               `<li class="main__cities-item" onclick="cityClickHandler('${city.name}', '${city.id}')">
                    <p class="main__cities-link">${city.name}</p>
               </li>`
          );
     });
});