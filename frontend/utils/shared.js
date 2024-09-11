const baseUrl = "https://divarapi.liara.run"

const getAllCities = async () => {
     const res = await axios({url:`${baseUrl}/v1/location`})
     const cities = await res.data

     return cities
}

export {
     baseUrl,
     getAllCities,
}