import { logOut, submitNumber, verifyOtp } from "../../utils/auth.js"
import { getAllLocations, getAndShowHeaderCityLocation, getAndShowSocials } from "../../utils/shared.js"
import { addParamToUrl, getFromLocalStorage, getMe, getURLParam, hideModal, isLogin, saveInLocalStorage, showModal } from "../../utils/utils.js"

const loadingContainer = document.querySelector('#loading-container')
const globalSearchInp = document.querySelector('#global_search_input')
const modalOverlay = document.querySelector('.searchbar__modal-overlay')
const headerCity = document.querySelector('.header__city')
const deleteAllSelectedCities = document.querySelector('#delete-all-cities')
const mostSearchContainer = document.querySelector('.header__searchbar-dropdown-list')
const citiesModalList = document.querySelector('#city_modal_list')
const citiesModalAcceptBtn = document.querySelector('.city-modal__accept')
const citiesModalCloseBtn = document.querySelector('.city-modal__close')
const cityModalError = document.querySelector('#city_modal_error')
const cityModalOverlay = document.querySelector('.city-modal__overlay')
const cityModalSearchInput = document.querySelector('#city-modal-search-input')
const submitPhoneNumberBtn = document.querySelector('.submit_phone_number_btn')

const mostSearchKeys = ["ماشین", "لباس", "ساعت", "کفش", "سامسونگ"]

const loginModalOverlay = document.querySelector('.login_modal_overlay')
const loginModalCloseBtn = document.querySelector('.login-modal__header-btn')
const loginBtn = document.querySelector('.login_btn')

const createPostBtn = document.querySelector('.create_post_btn')

let selectedCities = []
let allCities = []

getAllLocations().then(data => {
     allCities = data
     showProvinces(allCities)
});

const showProvinces = (data) => {
     document.querySelector('.city-modal__cities') ? document.querySelector('.city-modal__cities').scrollTop = 0 : null

     citiesModalList ? citiesModalList.innerHTML = '' : null
     data.provinces.forEach(province => citiesModalList?.insertAdjacentHTML('beforeend', `
               <li class="city-modal__cities-item province-item" data-province-id="${province.id}">
                    <span>${province.name}</span>
                    <i class="city-modal__cities-icon bi bi-chevron-left"></i>
               </li>
          `))

     const provincesItems = document.querySelectorAll('.province-item')

     provincesItems.forEach(province => {
          province.addEventListener('click', e => {
               const provinceID = e.target.dataset.provinceId
               const provinceName = e.target.querySelector('span').innerHTML
               const provinceCities = data.cities.filter(city => city.province_id == provinceID)

               citiesModalList.innerHTML = `
               <li id="city_modal_all_province" class="city_modal_all_province">
                    <span>همه شهر ها</span>
                    <i class="bi bi-arrow-right-short"></i>
               </li>
               <li class="city-modal__cities-item select-all-city city-item">
                    <span>همه شهر های ${provinceName}</span>
                    <div id="checkboxShape"></div>
                    <input type="checkbox" />
               </li>
               `
               // Add Cities To Provinces
               provinceCities.forEach(city => {
                    const isSelected = selectedCities.some(selectedCity => selectedCity.name === city.name)

                    citiesModalList.insertAdjacentHTML('beforeend', `
                         <li class="city-modal__cities-item city-item" id="city-${city.id}">
                             <span>${city.name}</span>
                             <div id="checkboxShape" class=${isSelected && "active"}></div>
                             <input id="city-item-checkbox" type="checkbox" onchange="cityItemClickHandler(${city.id})" checked="${isSelected}" />
                         </li>
                    `)
               })

               const backToAllProvince = document.querySelector('#city_modal_all_province')
               backToAllProvince.addEventListener('click', () => {
                    citiesModalList.innerHTML = ''
                    showProvinces(data)
               })
          })
     })
}

window.cityItemClickHandler = (cityID) => {
     const cityElem = document.querySelector(`#city-${cityID}`)
     const checkbox = cityElem.querySelector('input')
     const cityTitle = cityElem.querySelector('span').innerHTML
     const checkboxShape = cityElem.querySelector('#checkboxShape')

     selectedCities.forEach(city => {
          if (city.name === cityTitle) {
               checkbox.checked = true
          }
     })

     checkbox.checked = !checkbox.checked

     if (checkbox.checked) {
          updateSelectedCities(cityTitle, cityID)
          checkboxShape.classList.add('active')
     } else {
          checkboxShape.classList.remove('active')
          selectedCities = selectedCities.filter(city => city.name !== cityTitle)
          checkbox.checked = true

          checkboxShape.classList.remove('active')
          addCitiesToModal(selectedCities)
     }
     toggleCityModalBtns(selectedCities)

}

window.removeCityFromModal = (cityID) => {
     const currentCity = document.querySelector(`#city-${cityID}`)

     if (currentCity) {
          const checkbox = currentCity.querySelector('input')
          const checkboxShape = currentCity.querySelector('div')

          checkbox.checked = false
          checkboxShape.classList.remove('active')

          selectedCities = selectedCities.filter(city => city.id != cityID)
          addCitiesToModal(selectedCities)
          toggleCityModalBtns(selectedCities)
     }
}

const toggleCityModalBtns = (cities) => {
     if (cities.length) {
          citiesModalAcceptBtn.classList.replace('city-modal__accept', 'city-modal__accept--active')
          deleteAllSelectedCities.style.display = 'block'
          cityModalError.style.display = 'none'
     } else {
          citiesModalAcceptBtn.classList.replace('city-modal__accept--active', 'city-modal__accept')
          deleteAllSelectedCities.style.display = 'none'
          cityModalError.style.display = 'block'
     }
}

const updateSelectedCities = (cityTitle, cityID) => {
     const isTitleRepeated = selectedCities.some(city => city.name == cityTitle)

     if (!isTitleRepeated) {
          selectedCities.push({ name: cityTitle, id: cityID })
     }

     addCitiesToModal(selectedCities)
}

const addCitiesToModal = async (cities) => {
     const citySelected = document.querySelector('#city-selected')
     citySelected.innerHTML = ''

     cities.forEach(city => {
          citySelected.insertAdjacentHTML('beforeend', `
               <div class="city-modal__selected-item">
                    <span class="city-modal__selected-text">${city.name}</span>
                    <button class="city-modal__selected-btn" onclick="removeCityFromModal('${city.id}')">
                         <i class="city-modal__selected-icon bi bi-x"></i>
                    </button>
               </div>
          `)
     })
}

const showPanelLinks = async () => {
     const dropDown = document.querySelector('.header_dropdown_menu')
     const userLogin = await isLogin()
     let isInUserPanel = false

     if (location.href.includes('userPanel')) {
          isInUserPanel = true
     }

     dropDown ? dropDown.innerHTML = "" : null

     if (dropDown) {
          if (userLogin) {
               getMe().then((user) => {
                    dropDown.insertAdjacentHTML(
                         "beforeend",
                         `
                 <li class="header__left-dropdown-item header_dropdown-item_account">
                   <a href="${isInUserPanel ? './posts.html' : '../pages/userPanel/posts.html'}" class="header__left-dropdown-link login_dropdown_link">
                     <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
                     <div>
                       <span>کاربر دیوار </span>
                       <p>تلفن ${user.phone}</p>
                     </div>
                   </a>
                 </li>
                 <li class="header__left-dropdown-item">
                   <a class="header__left-dropdown-link" href="${isInUserPanel ? './verify.html' : '../pages/userPanel/verify.html'}">
                     <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                     تایید هویت
                   </a>
                 </li>
                 <li class="header__left-dropdown-item">
                   <a class="header__left-dropdown-link" href="${isInUserPanel ? './bookmarks.html' : '../pages/userPanel/bookmarks.html'}">
                     <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                     نشان ها
                   </a>
                 </li>
                 <li class="header__left-dropdown-item">
                   <a class="header__left-dropdown-link" href="${isInUserPanel ? './notes.html' : '../pages/userPanel/notes.html'}">
                     <i class="header__left-dropdown-icon bi bi-journal"></i>
                     یادداشت ها
                   </a>
                 </li>
                 <li class="header__left-dropdown-item logout-link" id="logout_btn">
                   <p class="header__left-dropdown-link" href="#">
                     <i class="header__left-dropdown-icon bi bi-shop"></i>
                     خروج
                   </p>
                 </li>
                         `
                    );
               });
          } else {
               dropDown.insertAdjacentHTML(
                    "beforeend",
                    `
               <li class="header__left-dropdown-item">
                 <span id="login-btn" class="header__left-dropdown-link login_dropdown_link">
                   <i class="header__left-dropdown-icon bi bi-box-arrow-in-left"></i>
                   ورود
                 </span>
               </li>
               <li class="header__left-dropdown-item">
                 <div class="header__left-dropdown-link" href="#">
                   <i class="header__left-dropdown-icon bi bi-bookmark"></i>
                   نشان ها
                 </div>
               </li>
               <li class="header__left-dropdown-item">
                 <div class="header__left-dropdown-link" href="#">
                   <i class="header__left-dropdown-icon bi bi-journal"></i>
                   یادداشت ها
                 </div>
               </li>
               <li class="header__left-dropdown-item">
                 <div class="header__left-dropdown-link" href="#">
                   <i class="header__left-dropdown-icon bi bi-clock-history"></i>
                   بازدید های اخیر
                 </div>
               </li>
           `
               );

               dropDown.addEventListener("click", () => {
                    showModal("login-modal", "login-modal--active");
               });
          }
     }
}

window.addEventListener("load", async () => {
     const isUserLogin = await isLogin()

     getAndShowSocials()
     getAndShowHeaderCityLocation()
     showPanelLinks().then(() => {
          getMe().then(user => {
               if (user) {
                    const logOutBtn = document.querySelector('.logout-link')

                    logOutBtn.addEventListener('click', () => {
                         logOut()
                    })
               }
          })
     })

     loadingContainer ? loadingContainer.style.display = 'none' : null

     globalSearchInp?.addEventListener('keydown', e => {
          if (e.keyCode == 13) {
               e.preventDefault()
               if (e.target.value.trim()) {
                    addParamToUrl('value', e.target.value.trim())
               }
          }
     })

     globalSearchInp?.addEventListener('click', () => {
          showModal('header__searchbar-dropdown', 'header__searchbar-dropdown--active')

          modalOverlay.addEventListener('click', () => {
               hideModal('header__searchbar-dropdown', 'header__searchbar-dropdown--active')
          })
     })

     mostSearchKeys.forEach(key => {
          const catID = getURLParam('categoryID')
          let href = `posts.html?value=${key}${catID ? `&categoryID=${catID}` : ''}`

          mostSearchContainer?.insertAdjacentHTML('beforeend', `
                    <li class="header__searchbar-dropdown-item">
                         <a href="${href}" class="header__searchbar-dropdown-link">${key}</a>
                    </li>
               `)
     })

     headerCity?.addEventListener('click', () => {
          const cities = getFromLocalStorage('cities')
          showModal('city-modal', 'city-modal--active')
          deleteAllSelectedCities.style.display = 'block'

          selectedCities = cities
          addCitiesToModal(selectedCities)
     })

     citiesModalAcceptBtn?.addEventListener('click', () => {
          const citiesIDs = selectedCities.map(city => city.id).join('|')
          addParamToUrl('cities', citiesIDs)

          saveInLocalStorage('cities', selectedCities)
          hideModal('city-modal', 'city-modal--active')
          getAndShowHeaderCityLocation()
          showProvinces(allCities)
     })

     citiesModalCloseBtn?.addEventListener('click', () => {
          hideModal('city-modal', 'city-modal--active')
          citiesModalAcceptBtn.classList.replace('city-modal__accept--active', 'city-modal__accept')
          showProvinces(allCities)
     })

     cityModalOverlay?.addEventListener('click', () => {
          hideModal('city-modal', 'city-modal--active')
          citiesModalAcceptBtn.classList.replace('city-modal__accept--active', 'city-modal__accept')
          showProvinces(allCities)
     })

     deleteAllSelectedCities?.addEventListener('click', () => {
          selectedCities = []
          addCitiesToModal(selectedCities)
          citiesModalAcceptBtn.classList.replace('city-modal__accept--active', 'city-modal__accept')
          cityModalError.style.display = 'block'
          deleteAllSelectedCities.style.display = 'none'
          showProvinces(allCities)
     })

     cityModalSearchInput?.addEventListener('keyup', e => {
          const filteredCities = allCities.cities.filter(city => city.name.includes(e.target.value))

          if (e.target.value.trim() && filteredCities.length) {

               citiesModalList.innerHTML = ''
               filteredCities.forEach(city => {
                    const isSelected = selectedCities.some(selectedCity => selectedCity.name === city.name)
                    console.log(city);

                    citiesModalList.insertAdjacentHTML('beforeend', `
                    <li class="city-modal__cities-item city-item" id="city-${city.id}">
                         <span>${city.name}</span>
                         <div id="checkboxShape" class="${isSelected && 'active'}"></div>
                         <input id="city-item-checkbox" type="checkbox" onchange="cityItemClickHandler('${city.id}')" checked=true>
                    </li>
                         `)
               })

          } else {
               if (e.target.value.trim() === '') {
                    showProvinces(allCities)
               }
          }
     })

     // User Login
     loginModalOverlay?.addEventListener('click', () => {
          hideModal('login-modal', 'active_step_2')
          hideModal('login-modal', 'login-modal--active')
     })

     loginModalCloseBtn?.addEventListener('click', () => {
          hideModal('login-modal', 'active_step_2')
          hideModal('login-modal', 'login-modal--active')
     })

     submitPhoneNumberBtn?.addEventListener('click', e => {
          e.preventDefault()
          submitNumber()
     })

     loginBtn?.addEventListener('click', () => {
          verifyOtp()
     })

     // Create New Post
     createPostBtn?.addEventListener("click", () => {
          console.log('clicked');
          if (isUserLogin) {
               location.href = `./new.html`
          } else {
               showModal('login-modal', 'login-modal--active')
          }
     })
})