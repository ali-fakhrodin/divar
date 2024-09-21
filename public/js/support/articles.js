import { baseUrl, getArticles } from "../../../utils/shared.js";
import { getURLParam } from "../../../utils/utils.js";

window.addEventListener('load', async () => {
     const categoryID = getURLParam("id");
     const breadcrumbSpan = document.querySelector("#breadcrumb span");
     const articlesContainer = document.querySelector("#articles");
     const categoryInfo = document.querySelector("#category-info");

     const allCatArticles = await getArticles()

     const mainCategory = allCatArticles.find(cat => cat._id = categoryID)

     console.log(allCatArticles);
     console.log(mainCategory);

     breadcrumbSpan.innerHTML = mainCategory.name;
     document.title = mainCategory.name;

     categoryInfo.insertAdjacentHTML(
          "beforeend",
          `
         <img class="category-info-icon" src="${baseUrl}/${mainCategory.pic.path}" />
         <p class="category-info-title">${mainCategory.name}</p>
       `
     );

     mainCategory.articles.map((article) => {
          articlesContainer.insertAdjacentHTML(
               "beforeend",
               `
                <a href="../../pages/support/article.html?id=${article._id
               }" class="article">
                    <div>
                        <p>${article.title}</p>
                        <span>${article.body.slice(0, 180)} ...</span>
                    </div>
                    <i class="bi bi-arrow-left"></i>
                </a>
            `
          );
     });
})
