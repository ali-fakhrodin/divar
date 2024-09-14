import { getAndShowSocials } from "../../utils/shared.js"
import { addParamToUrl, getURLParam, hideModal, showModal } from "../../utils/utils.js"

const mostSearchKeys = ["ماشین", "لباس", "ساعت", "کفش", "سامسونگ"]
const mostSearchContainer = document.querySelector('.header__searchbar-dropdown-list')

window.addEventListener("load", () => {
     const loadingContainer = document.querySelector('#loading-container')
     loadingContainer.style.display = 'none'

     getAndShowSocials()

     const globalSearchInp = document.querySelector('#global_search_input')

     globalSearchInp?.addEventListener('keydown', e => {
          if (e.keyCode == 13) {
               e.preventDefault()
               if (e.target.value.trim()) {
                    addParamToUrl('value', e.target.value.trim())
               }
          }
     })

     globalSearchInp?.addEventListener('click', () => {
          const modalOverlay = document.querySelector('.searchbar__modal-overlay')
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
})