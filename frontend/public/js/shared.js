import { getAndShowSocials } from "../../utils/shared.js"
import { addParamToUrl } from "../../utils/utils.js"

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
})