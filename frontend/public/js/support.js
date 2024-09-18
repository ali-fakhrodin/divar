import { baseUrl, getSupportArticles } from "../../utils/shared.js"

window.addEventListener('load', async () => {
     const supportArticlesCategory = await getSupportArticles()

     const popularArticlesElement = document.querySelector("#popular-articles");
     const categoriesContainerElement = document.querySelector("#categories-container");

     const popularArticles = supportArticlesCategory.find(
          (category) => category.shortName === "popular_articles"
     );

     popularArticles.articles.map(article => {
          popularArticlesElement.insertAdjacentHTML('beforeend', `
          <a href="../pages/support/article.html?id=${article._id}" class="article">
               <p>${article.title}</p>
               <span>${article.body.slice(0, 180)} ...</span>
               <div>
               <i class="bi bi-arrow-left"></i>
               <p>ادامه مقاله</p>
               </div>
            </a>
               `)
     })

     supportArticlesCategory.map(category => {          
          categoriesContainerElement.insertAdjacentHTML(
               "beforeend",
               `
                <a href="../pages/support/articles.html?id=${category._id}">
                    <img src="${baseUrl}/${category.pic.path}" width="64" height="64" alt="pic" />
                    <div>
                         <p>${category.name}</p>
                         <span>نحوه انجام پرداخت، استفاده از کیف پول، افزایش بازدید، استفاده از</span>
                    </div>
                    <i class="bi bi-chevron-left"></i>
                </a>
            `
          );
     })
})