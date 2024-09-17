import { baseUrl, getPostDetails } from "../../utils/shared.js"
import { calcTimeFormat, getToken, hideModal, isLogin, showModal } from "../../utils/utils.js";

window.addEventListener('load', () => {
     getPostDetails().then(async res => {
          const postDetails = res.post

          const isUserLogin = await isLogin()
          const token = getToken()
          let noteID = postDetails.note._id

          const postTitleElem = document.querySelector('#post-title')
          const postDescElem = document.querySelector('#post-description')
          const postLocationElem = document.querySelector('#post-location')
          const shareIconElem = document.querySelector('#share-icon')
          const postInfos = document.querySelector('#post-infos-list')
          const postPreview = document.querySelector("#post-preview");
          const mainSlider = document.querySelector("#main-slider-wrapper");
          const secendSlider = document.querySelector("#secend-slider-wrapper");
          const noteTextarea = document.querySelector("#note-textarea");
          const noteTrashIcon = document.querySelector("#note-trash-icon");
          const postFeedbackIcons = document.querySelectorAll(".post_feedback_icon");
          const phoneInfoBtn = document.querySelector("#phone-info-btn");

          const loginModalOverlay = document.querySelector("#login_modal_overlay");

          postTitleElem.innerHTML = postDetails.title
          postDescElem.innerHTML = postDetails.description

          const date = calcTimeFormat(postDetails.createdAt)
          postLocationElem.innerHTML = `${date} در ${postDetails.city.name}${'،' + '&nbsp;' + postDetails.neighborhood?.name}`

          shareIconElem.addEventListener('click', async () => {
               await navigator.share(location.href)
          })

          postInfos.insertAdjacentHTML('beforeend', `
                    <li class="post__info-item">
                         <span class="post__info-key">قیمت</span>
                         <span class="post__info-value">${postDetails.price.toLocaleString()} تومان</span>
                    </li>
               `)

          postDetails.dynamicFields.map(field => {
               postInfos.insertAdjacentHTML('beforeend', `
                    <li class="post__info-item">
                         <span class="post__info-key">${field.name}</span>
                         <span class="post__info-value">${field.data}</span>
                    </li>
               `)
          })

          phoneInfoBtn.addEventListener('click', () => {
               Swal.fire({
                    title: `شماره تماس : ${postDetails.creator.phone}`,
                    confirmButtonText: 'تماس گرفتن',
               })
          })

          postFeedbackIcons.forEach(icon => {
               icon.addEventListener('click', () => {
                    postFeedbackIcons.forEach(icon => {
                         icon.classList.remove('active')
                    })
                    icon.classList.add('active')
               })
          })

          // Note Textaria
          if (isUserLogin) {
               if (postDetails.note) {
                    noteTextarea.value = postDetails.note.content
                    noteTrashIcon.style.display = 'block'
                    noteID = postDetails.note._id
               }

               noteTrashIcon.addEventListener('click', () => {
                    noteTextarea.value = ''
                    noteTrashIcon.style.display = 'none'
               })

               noteTextarea.addEventListener('keyup', () => {
                    if (noteTextarea.value.trim()) {
                         noteTrashIcon.style.display = 'block'
                    } else {
                         noteTrashIcon.style.display = 'none'
                    }
               })

               noteTextarea.addEventListener('blur', async () => {
                    if (noteID) {
                         await axios({
                              url: `${baseUrl}/v1/note/${noteID}`,
                              method: 'put',
                              data: JSON.stringify({ content: noteTextarea.value }),
                              headers: {
                                   "Content-Type": "application/json",
                                   Authorization: `Bearer ${token}`
                              },
                         })
                    } else {
                         await axios({
                              url: `${baseUrl}/v1/note`,
                              method: 'post',
                              data: JSON.stringify({ postId: postDetails._id, content: noteTextarea.value }),
                              headers: {
                                   "Content-Type": "application/json",
                                   Authorization: `Bearer ${token}`
                              },
                         })
                    }
               })

          } else {
               noteTextarea.addEventListener('focus', e => {
                    e.preventDefault()
                    hideModal('login-modal', 'active_step_2')
                    showModal('login-modal', 'login-modal--active')
               })
          }
     })
})