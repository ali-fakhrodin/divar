import { getPostDetails } from "../../utils/shared.js"
import { calcTimeFormat, isLogin } from "../../utils/utils.js";

window.addEventListener('load', () => {
     getPostDetails().then(res => {
          const postDetails = res.post

          const isUserLogin = isLogin()
          
          const postTitleElem = document.querySelector('#post-title')
          const postDescElem = document.querySelector('#post-description')
          const postLocationElem = document.querySelector('#post-location')
          const shareIconElem = document.querySelector('#share-icon')
          const postInfos = document.querySelector('#post-infos-list')
          const postPreview = document.querySelector("#post-preview");
          const mainSlider = document.querySelector("#main-slider-wrapper");
          const secendSlider = document.querySelector("#secend-slider-wrapper");
          const noteTextarea = document.querySelector("#note-textarea");
          const postFeedbackIcons = document.querySelectorAll(".post_feedback_icon");

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

     })
})