import { getAndShowSocials } from "../../utils/shared.js"

window.addEventListener("load", () => {
     const loadingContainer = document.querySelector('#loading-container')
     loadingContainer.style.display = 'none'

     getAndShowSocials()
})