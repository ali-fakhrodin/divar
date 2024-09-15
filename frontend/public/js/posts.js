import { baseUrl, getPosts, getPostsCategories } from "../../utils/shared.js"
import { addParamToUrl, getFromLocalStorage, calcTimeFormat, getURLParam, removeParamFromURL, hideModal } from "../../utils/utils.js"

const categoryID = getURLParam('categoryID')
let posts = null
let backupPosts = null
let appliedFilters = {}

const generatePosts = async (posts) => {
     const postContainer = document.querySelector('#posts-container')

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
}

const findSubcategoryByID = (categories, categoryID) => {
     const allSubCategories = categories.flatMap(category => category.subCategories)
     return allSubCategories.find(sub => sub._id === categoryID)
}

const findSubSubcategoryByID = (categories, categoryID) => {
     const allSubCategories = categories.flatMap(category => category.subCategories)
     const allSubSubCategories = allSubCategories.flatMap(category => category.subCategories)

     return allSubSubCategories.find(sub => sub._id === categoryID)
}

const filterGenerator = (filter) => {
     const sidebarFiltersContainer = document.querySelector('#sidebar-filters')
     // sidebarFiltersContainer.innerHTML = ''
     sidebarFiltersContainer.insertAdjacentHTML("beforebegin", `
                 ${filter.type === "selectbox" ? `
                <div class="accordion accordion-flush" id="accordionFlushExample">
                  <div class="accordion-item">
                    <h2 class="accordion-header">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#accordion-${filter.slug}"
                        aria-expanded="false"
                        aria-controls="accordion-${filter.name}">
                        <span class="sidebar__filter-title">${filter.name}</span>
                    </button>
                    </h2>
                    <div
                      id="accordion-${filter.slug}"
                      class="accordion-collapse collapse"
                      aria-labelledby="accordion-${filter.name}"
                      data-bs-parent="#accordionFlushExample">
                      <div class="accordion-body">
                        <select class="selectbox" onchange="selectBoxFilterHandler(event.target.value, '${filter.slug}')">
                          ${filter.options
                    .sort((a, b) => b - a)
                    .map((option) => `<option value='${option}'>${option}</option>`)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              `
               : ""
          }

        ${filter.type === "checkbox"
               ? `
                <div class="sidebar__filter">
                  <label class="switch">
                    <input id="exchange_controll" class="icon-controll" type="checkbox" />
                    <span class="slider round"></span>
                  </label>
                  <p>${filter.name}</p>
                </div>
              `
               : ""
          }
      `)
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

window.selectBoxFilterHandler = (value, slug) => {
     appliedFilters[slug] = value

     applyFilters()
}

window.hideModal = hideModal

const justPhotoController = document.querySelector('#just_photo_controll')
const exchangeController = document.querySelector('#exchange_controll')
const minPriceSelectbox = document.querySelector('#min-price-selectbox')
const maxPriceSelectbox = document.querySelector('#max-price-selectbox')

const applyFilters = () => {
     let filteredPosts = backupPosts

     // Custom Filter
     for (const slug in appliedFilters) {
          filteredPosts = filteredPosts.filter(post =>
               post.dynamicFields.some(field => field.slug == slug && field.data == appliedFilters[slug]))
     }

     if (justPhotoController.checked) {
          filteredPosts = filteredPosts.filter(post => post.pics.length)
     }
     if (exchangeController.checked) {
          filteredPosts = filteredPosts.filter(post => post.exchange)
     }

     // Min and Max
     const minPrice = minPriceSelectbox.value
     const maxPrice = maxPriceSelectbox.value

     if (maxPrice !== "default") {

          if (minPrice !== "default") {
               filteredPosts = filteredPosts.filter(post => post.price >= minPrice && post.price <= maxPrice)
          } else {
               filteredPosts = filteredPosts.filter(post => post.price <= maxPrice)
          }

     } else {
          if (minPrice !== "default") {
               filteredPosts = filteredPosts.filter(post => post.price >= minPrice)
          }
     }

     generatePosts(filteredPosts)
}

minPriceSelectbox.addEventListener('change', () => {
     applyFilters()
})

maxPriceSelectbox.addEventListener('change', () => {
     applyFilters()
})

justPhotoController.addEventListener('change', () => {
     applyFilters()
})

exchangeController.addEventListener('change', () => {
     applyFilters()
})

window.addEventListener('load', async () => {
     const cities = getFromLocalStorage('cities')
     const searchValue = getURLParam('value')
     const cityID = Number((cities)[0]?.id)
     
     const allPostsDatas = await getPosts(cityID)
     const categoriesContainer = document.querySelector('#categories-container')
     
     posts = allPostsDatas.posts
     backupPosts = allPostsDatas.posts

     generatePosts(allPostsDatas.posts)
     
     const categories = await getPostsCategories()

     if (categoryID) {
          const catInfos = categories.filter(cat => cat._id == categoryID)
          if (!catInfos.length) {
               const subCategory = findSubcategoryByID(categories, categoryID)
               subCategory?.filters.forEach(filter => filterGenerator(filter))
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
                    const subSubCategory = findSubSubcategoryByID(categories, categoryID)
                    const subSubCategoryParent = findSubcategoryByID(categories, subSubCategory.parent)

                    subSubCategory?.filters.forEach(filter => filterGenerator(filter))

                    categoriesContainer.insertAdjacentHTML('beforeend', `
                         <div class="all-categories" onclick="backToAllCategories()">
                           <p>همه اگهی ها</p>
                           <i class="bi bi-arrow-right"></i>
                         </div>
                         <div class="sidebar__category-link active-category" href="#">
                              <div class="sidebar__category-link_details" onclick="categoryClickHandler('${subSubCategoryParent._id}')">
                                   <i class="sidebar__category-icon bi bi-house"></i>
                                   <p>${subSubCategoryParent.title}</p>
                              </div>
                              <ul class="subCategory-list">
                                   ${subSubCategoryParent.subCategories.map(createSubCategoryHtml).join("")}
                              </ul>
                         </div>
                    `)
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

     // Global Search
     const removeSearchValueIcon = document.querySelector('#remove-search-value-icon')
     const searchInp = document.querySelector('#global_search_input')

     searchInp.addEventListener('keyup', () => {
          if (searchInp.value) {
               removeSearchValueIcon.style.display = 'block'
          } else {
               removeSearchValueIcon.style.display = 'none'
          }
     })
     removeSearchValueIcon.addEventListener('click', () => {
          removeParamFromURL('value')
          searchInp.value = ''
     })
     if (searchValue) {
          removeSearchValueIcon.style.display = 'block'
          searchInp.value = searchValue
     }
})