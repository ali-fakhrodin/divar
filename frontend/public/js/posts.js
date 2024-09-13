import { baseUrl, getPosts, getPostsCategories } from "../../utils/shared.js"
import { addParamToUrl, getFromLocalStorage, calcTimeFormat, getURLParam, removeParamFromURL } from "../../utils/utils.js"

const categoryID = getURLParam('categoryID')

const generatePosts = async (posts) => {
     const postContainer = document.querySelector('#posts-container')
     const categoriesContainer = document.querySelector('#categories-container')

     if (posts.length) {
          postContainer.innerHTML = ''
          posts.forEach(post => {
               const date = calcTimeFormat(post.createdAt)
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
                    <span class="product-card__time">${date}</span>
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

     const categories = await getPostsCategories()

     categoriesContainer.innerHTML = ''

     if (categoryID) {
          const catInfos = categories.filter(cat => cat._id == categoryID)
          console.log('catInfos =>', catInfos);

          if (!catInfos.length) {
               const subCategory = findSubcategoryByID(categories, categoryID)

               if (subCategory) {
                    categoriesContainer.insertAdjacentHTML('beforeend', `
                    <div class="all-categories">
                         <p onclick="backToAllCategories()">همه اگهی ها</p>
                            <i class="bi bi-arrow-right"></i>
                         </div>
                         <div class="sidebar__category-link active-category" href="#" id="category-${subCategory._id}">
                              <div class="sidebar__category-link_details">
                              <i class="sidebar__category-icon bi bi-house"></i>
                              <p>${subCategory.title}</p>
                         </div>
                         <ul class="subCategory-list">
                              ${subCategory.subCategories.map(createSubCategoryHtml).join("")}
                         </ul>
                    </div>
                         `)
               } else {

               }

          } else {
               catInfos.forEach(cat => {
                    categoriesContainer.insertAdjacentHTML('beforeend', `
                         <div class="all-categories">
                              <p onclick="backToAllCategories()">همه اگهی ها</p>
                         <i class="bi bi-arrow-right"></i>
                         </div>

                         <div class="sidebar__category-link active-category" href="#">
                           <div class="sidebar__category-link_details">
                             <i class="sidebar__category-icon bi bi-house"></i>
                             <p>${cat.title}</p>
                           </div>
                           <ul class="subCategory-list">
                             ${cat.subCategories.map(createSubCategoryHtml).join('')}
                           </ul>
                         </div>
                    `)
               })
          }

     } else {
          categories.forEach(cat => {
               categoriesContainer.insertAdjacentHTML('beforeend', `
                    <div class="sidebar__category-link" id="category-${cat._id}">
                         <div class="sidebar__category-link_details" onclick="categoryClickHandler('${cat._id}')">
                              <i class="sidebar__category-icon bi bi-house"></i>
                              <p>${cat.title}</p>
                         </div>
                     </div>
               `)
          })
     }
}

const findSubcategoryByID = (categories, categoryID) => {
     const allSubCategories = categories.flatMap(category => category.subCategories)
     return allSubCategories.find(sub => sub._id === categoryID)
}

const createSubCategoryHtml = (subCategory) => {
     return `
       <li class="${categoryID === subCategory._id ? "active-subCategory" : ""}" onclick="categoryClickHandler('${subCategory._id}')">
         ${subCategory.title}
       </li>
     `;
};

window.categoryClickHandler = (catID) => {
     addParamToUrl('categoryID', catID)
}

window.backToAllCategories = () => {
     removeParamFromURL("categoryID")
}

window.addEventListener('load', async () => {
     const cities = getFromLocalStorage('cities')
     const cityID = Number(JSON.parse(cities)[0].id)

     const allPostsDatas = await getPosts(cityID)

     generatePosts(allPostsDatas.posts)
})