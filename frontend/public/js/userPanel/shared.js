import { getMe, isLogin } from '../../../utils/utils.js';

const sidebarPhoneNumber = document.querySelector('#sidebar-phone-number')


window.addEventListener('load', async () => {
     const isUserLogin = await isLogin()

     if (isUserLogin) {
          getMe().then(user => {
               sidebarPhoneNumber.innerHTML = user.phone
               console.log(user);
          })
     } else {
          location.href = '../posts.html'
     }
})