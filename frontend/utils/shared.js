import { getFromLocalStorage, getURLParam, saveInLocalStorage } from "./utils.js"

const baseUrl = "https://divarapi.liara.run"

const getAllCities = async () => {
     const res = await axios({ url: `${baseUrl}/v1/location` })
     const cities = await res.data

     return cities
}

const getAllLocations = async () => {
     const res = await axios ({url: `${baseUrl}/v1/location`})
     const response = res.data

     return response.data
}

const getAndShowSocials = async () => {
     const socialMediaContainer = document.querySelector('#footer__social-media')
     const res = await axios({ url: `${baseUrl}/v1/social` })
     const socials = await res.data.data.socials

     socials.forEach(social => {
          socialMediaContainer.insertAdjacentHTML('beforeend', `
                    <a href="https://${social.link}" target="b_lank" class="sidebar__icon-link">
                         <img src="./public/${social.icon.path}" width="20px" height="20px" alt="${social.name}" class="sidebare__icon" />
                    </a>
               `)
     });

     return socials
}

const getPosts = async (citiesIDs) => {
     const catID = getURLParam("categoryID")
     const searchValue = getURLParam("value")

     let url = `${baseUrl}/v1/post/?city=${citiesIDs}`
     
     if (catID) {
          url += `&categoryId=${catID}`
     }
     if (searchValue) {
          url += `&search=${searchValue}`
     }

     const res = await axios({ url: url })
     const posts = await res.data.data

     return posts
}

const getPostsCategories = async () => {
     const res = await axios({ url: `${baseUrl}/v1/category` })
     const categories = res.data.data.categories

     return categories
}

const getAndShowHeaderCityLocation = () => {
     const userCities = getFromLocalStorage('cities')
     const headerCityTitle = document.querySelector('#header-city-title')

     if (!userCities) {
          saveInLocalStorage("cities", [{ name: "تهران", id: 301 }])
          location.reload()
     } else if (userCities.length === 1) {
          headerCityTitle ? headerCityTitle.innerHTML = userCities[0].name : ''
     } else {
          headerCityTitle ? headerCityTitle.innerHTML = `بیش از ${userCities.length} شهر ` : ''
     }
}

const getPostDetails = async () => {
     const postID = getURLParam('id')

     const res = await axios ({url: `${baseUrl}/v1/post/${postID}`})
     const response = await res.data.data
 
     console.log(response);
}

export {
     baseUrl,
     getAllCities,
     getAndShowSocials,
     getPosts,
     getPostsCategories,
     getAndShowHeaderCityLocation,
     getAllLocations,
     getPostDetails,
}