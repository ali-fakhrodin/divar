const saveInLocalStorage = (key, value) => {
     localStorage.setItem(key, JSON.stringify(value))
}

const getFromLocalStorage = (key) => {
     return localStorage.getItem(key)
}

const addParamToUrl = (param, value) => {
     const url = new URL(location.href)
     const searchParams = url.searchParams

     searchParams.set(param, value)
     location.href = url.toString()
}

export {
     saveInLocalStorage,
     getFromLocalStorage,
     addParamToUrl,
}