const saveInLocalStorage = (key, value) => {
     localStorage.setItem(key, JSON.stringify(value))
}

const getFromLocalStorage = (key) => {
     return JSON.parse(localStorage.getItem(key))
}

const addParamToUrl = (param, value) => {
     const url = new URL(location.href)
     const searchParams = url.searchParams

     searchParams.set(param, value)
     location.href = url.toString()
}

const getURLParam = param => {
     const urlParams = new URLSearchParams(location.search)

     return urlParams.get(param)
}

const removeParamFromURL = (param) => {
     const url = new URL(location.href)
     url.searchParams.delete(param)
     window.history.replaceState(null, null, url)
     console.log(url);
     location.reload()
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

const showModal = (id, className) => {
     const element = document.querySelector(`#${id}`)
     element.classList.add(className)
}

const hideModal = (id, className) => {
     const element = document.querySelector(`#${id}`)
     element.classList.remove(className)
}

export {
     saveInLocalStorage,
     getFromLocalStorage,
     addParamToUrl,
     calcTimeFormat,
     getURLParam,
     removeParamFromURL,
     showModal,
     hideModal,
}