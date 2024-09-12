import { baseUrl, getPosts } from "../../utils/shared.js"
import { getFromLocalStorage } from "../../utils/utils.js"

const generatePosts = (posts) => {
     const postContainer = document.querySelector('#posts-container')
     if (posts.length) {
          postContainer.innerHTML = ''
          posts.forEach(post => {
               console.log(post);
               postContainer.insertAdjacentHTML('beforeend', `
                    <div class="col-4">
              <a href="./post.html" class="product-card">
                <div class="product-card__right">
                  <div class="product-card__right-top">
                    <p class="product-card__link">${post.title}</p>
                  </div>
                  <div class="product-card__right-bottom">
                    <span class="product-card__condition">${post.dynamicFields[0].data
                    }</span>
                    <span class="product-card__price">
                      ${post.price === 0
                         ? "توافقی"
                         : post.price.toLocaleString() + " تومان"
                    }
                    </span>
                    <span class="product-card__time">Date</span>
                  </div>
                </div>
                <div class="product-card__left">
                ${post.pics.length
                         ? `
                      <img
                        class="product-card__img img-fluid"
                        src="${baseUrl}/${post.pics[0].path}"
                      />`
                         : `
                      <img
                        class="product-card__img img-fluid"
                        src="../public/images/main/noPicture.PNG"
                      />`
                    }
                  
                </div>
              </a>
            </div>
        
               `)
          })
     } else {
          postContainer.innerHTML = '<p class="empty">آگهی یافت نشد!</p>'
     }
}

window.addEventListener('load', async () => {
     const cities = getFromLocalStorage('cities')
     const cityID = Number(JSON.parse(cities)[0].id)

     const allPostsDatas = await getPosts(cityID)
     console.log(cityID);
     console.log(allPostsDatas.posts);

     generatePosts(allPostsDatas.posts)
})