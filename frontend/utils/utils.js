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

const calcTimeFormat = (createdAt) => {
     const currentTime = new Date()
     const createdTime = new Date(createdAt)

     const timeDiffrence = (currentTime - createdTime)
     const hours = Math.floor(timeDiffrence / (1000 * 3600))

     if (hours < 24) {
          return `${hours} ساعت پیش`
     } else {
          const days = Math.floor(timeDiffrence / (1000 * 3600 * 24))
          return `${days} روز پیش`
     }
}

export {
     saveInLocalStorage,
     getFromLocalStorage,
     addParamToUrl,
     calcTimeFormat,
}