import { logOut } from '../../../utils/auth.js';
import { getMe, isLogin } from '../../../utils/utils.js';

const sidebarPhoneNumber = document.querySelector('#sidebar-phone-number')
const sidebarLinkItem = document.querySelector('.sidebar__link-item')

sidebarLinkItem.addEventListener('click', () => {
     logOut()
})

window.addEventListener('load', async () => {
     const isUserLogin = await isLogin()

     if (isUserLogin) {
          getMe().then(user => {
               sidebarPhoneNumber.innerHTML = user.phone
          })
     } else {
          location.href = '../posts.html'
     }
})