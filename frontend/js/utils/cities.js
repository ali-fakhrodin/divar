const fetchAllCities = async () => {
     const res = await axios ({url: `http://localhost:4000/api/cities`})
     const cities = await res.data

     return cities
}

const fetchPopularCities = async () => {
     const res = await axios('http://localhost:4000/api/cities/popular')
     const popularCities = await res.data

     return popularCities
}

const setCityCookie = (city) => {
     document.cookie = `city=${city}; path=/`
}

const getCityCookie = () => {
     const cookieName = 'city='
     const cookiesArray = document.cookie.split(';')

     let result = null
     cookiesArray.forEach(cookie => {
          if (cookie.indexOf('city') === 0) {
               result = cookie.slice(cookieName.length)
          }
     })

     return result
}


export {
     fetchPopularCities,
     setCityCookie,
     getCityCookie,
     fetchAllCities,
}