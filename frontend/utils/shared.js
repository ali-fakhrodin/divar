const baseUrl = "https://divarapi.liara.run"

const getAllCities = async () => {
     const res = await axios({ url: `${baseUrl}/v1/location` })
     const cities = await res.data

     return cities
}

const getAndShowSocials = async () => {
     const socialMediaContainer = document.querySelector('#footer__social-media')
     const res = await axios({url: `${baseUrl}/v1/social`})
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
export {
     baseUrl,
     getAllCities,
     getAndShowSocials,
}