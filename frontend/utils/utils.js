import { baseUrl } from "./shared.js"

const saveInLocalStorage = (key, value) => {
     localStorage.setItem(key, JSON.stringify(value))
}

const getToken = () => {
     const token = getFromLocalStorage('divar')
     return token
}

const isLogin = async () => {
     const token = getToken()

     if (token) {
          const res = await axios({
               url: `${baseUrl}/v1/auth/me`,
               headers: {
                    Authorization: `Bearer ${token}`
               }
          });
          return res.status === 200 ? true : false
     } else {
          return false
     }
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

const getMe = async () => {
     const token = getToken()

     if (!token) {
          return false
     }
     
     const res = await axios({
          url: `${baseUrl}/v1/auth/me`,
          headers: {
               Authorization: `Bearer ${token}`
          }
     })
     const response = await res.data.data.user

     return response
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
     isLogin,
     getToken,
     getMe,
}