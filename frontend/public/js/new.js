import { baseUrl } from "../../utils/shared.js";
import { isLogin } from "../../utils/utils.js";

window.addEventListener('load', async () => {
     const isUserLogin = await isLogin()
     const showCategoies = document.querySelector(".show-categoies");
     const categoriesContainer = document.querySelector("#categories-container");
     const categoriesSection = document.querySelector("#categories");
     const descriptionCheckbox = document.querySelector("#description-checkbox");

     !isUserLogin ? location.href = './posts.html' : null

     const res = await axios({ url: `${baseUrl}/v1/category` })
     const categories = await res.data.data.categories

     showCategoies.addEventListener("click", () => {
          showCategoies.classList.remove("active");
          categoriesContainer.classList.add("active");
     });

     const generateCategoriesTemplate = (categories, title, id) => {
          categoriesSection.innerHTML = "";

          if (title) {
               categoriesSection.insertAdjacentHTML(
                    "beforeend",
                    `
                      <div class="back" onclick="${
                         id ? `categoryClickHandler('${id}')` : `backToAllCategories()`
                      }">
                       <i class="bi bi-arrow-right"></i>
                       <p>بازگشت به ${title}</p>
                      </div>
                    `
               )
          }

          categories.map((category) => {
               categoriesSection.insertAdjacentHTML(
                    "beforeend",
                    `
                  <div class="box" onclick="categoryClickHandler('${category._id}')">
                      <div class="details">
                      <div>
                          <i class="bi bi-house-door"></i>
                          <p>${category.title}</p>
                      </div>
                  
                      ${descriptionCheckbox.checked
                         ? `<span>${category.description}</span>`
                         : ""
                    }
                      
                      </div>
                      <i class="bi bi-chevron-left"></i>
                  </div>
                    `
               );
          });
     };

     window.categoryClickHandler = async (catID) => {
          const category = categories.find(cat => cat._id === catID)

          if (category) {
               generateCategoriesTemplate(category.subCategories, 'همه دسته ها', null)
          } else {
               const allSubCats = categories.flatMap(cat => cat.subCategories)
               const subCategory = allSubCats.find(subCat => subCat._id === catID)
               
               if (subCategory) {
                    const subCategoryParent = categories.find(cat => cat._id === subCategory.parent)
                    
                    generateCategoriesTemplate(subCategory.subCategories, subCategoryParent.title, subCategoryParent._id)
               } else {
                    location.href = `./new/registerPost.html?subCategoryID=${catID}`
               }
          }
     }

     window.backToAllCategories = async () => {
          generateCategoriesTemplate(categories)
     }

     generateCategoriesTemplate(categories)

     descriptionCheckbox.addEventListener("change", () => {
          generateCategoriesTemplate(categories);
     });
})