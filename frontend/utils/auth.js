import { baseUrl } from "./shared.js"
import { hideModal, saveInLocalStorage, showModal } from "./utils.js"

const step1LoginFormError = document.querySelector('.step-1-login-form__error')
const phoneNumberInput = document.querySelector('.phone_Number_input')
const userNumberNotice = document.querySelector('.user_number_notice')
// const requestTimerContainer = document.querySelector('.request_timer')
const requestTimerCount = document.querySelector('.request_timer span')
const requestNewCodeBtn = document.querySelector('.request_timer p')
const loading = document.querySelector('#loading-container')
const otpInput = document.querySelector('.code_input')
const step2LoginFormError = document.querySelector('.step-2-login-form__error')

const submitNumber = async () => {
     loading.classList.add('active-login-loader')
     const phoneRegEx = RegExp(/^(09)[0-9]{9}$/)
     const phoneNumber = phoneNumberInput.value
     const isValidPhoneNumber = phoneRegEx.test(phoneNumber)

     if (isValidPhoneNumber) {
          step1LoginFormError.innerHTML = ''
          const res = await axios({
               url: `${baseUrl}/v1/auth/send`,
               method: 'post',
               headers: {
                    'Content-Type': 'application/json'
               },
               data: JSON.stringify({ phone: phoneNumber })
          })
          if (res.status === 200) {
               loading.classList.remove('active-login-loader')
               showModal('login-modal', 'active_step_2')
               userNumberNotice.innerHTML = phoneNumber
               requestNewCodeBtn.style.display = 'none'
               requestTimerCount.style.display = 'block'
               let count = 30

               const timer = setInterval(() => {
                    count--
                    requestTimerCount.textContent = count
                    if (count == 0) {
                         clearInterval(timer)
                         requestNewCodeBtn.style.display = 'block'
                         requestTimerCount.style.display = 'none'
                         requestTimerCount.textContent = 30
                    }
               }, 1000)
          }
     } else {
          loading.classList.remove('active-login-loader')
          step1LoginFormError.innerHTML = 'شماره تماس وارد شده معتبر نیست'
     }
}

const verifyOtp = async () => {
     loading.classList.add('active-login-loader')
     const otpRegEx = RegExp(/^\d{4}$/)
     const userOtp = otpInput.value
     const isValidOtp = otpRegEx.test(userOtp)
     
     if (isValidOtp) {
          loading.classList.remove('active-login-loader')
          step2LoginFormError.innerHTML = ''
          const res = await axios ({
               url: `${baseUrl}/v1/auth/verify`,
               method: 'post',
               headers: {
                    'Content-Type': 'application/json'
               },
               data: JSON.stringify({phone: phoneNumberInput.value, otp: userOtp})
          })
          
          if (res.status === 200 || res.status === 201) {
               const response = await res.data.data
               saveInLocalStorage('divar', response.token)

               hideModal('login-modal', 'login-modal--active')
               loading.classList.remove('active-login-loader')
               Swal.fire({
                    title: 'لاگین با موفقیت انجام شد',
                    confirmButtonText: 'اوکیه',
                    icon: 'success'
               }).then(() => location.href = './userPanel/verify.html')

          } else {
               loading.classList.remove('active-login-loader')
               step2LoginFormError.innerHTML = 'کد وارد شده نا معتبره!'
          }
     } else {
          loading.classList.remove('active-login-loader')
          step2LoginFormError.innerHTML = 'کد وارد شده نا معتبره!'
     }
}

export {
     submitNumber,
     verifyOtp,
}