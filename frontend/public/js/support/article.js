import { getArticleByID } from "../../../utils/shared.js"
import { getURLParam } from "../../../utils/utils.js"

window.addEventListener('load', async () => {
     const articleID = getURLParam('id')
     const articleDetails = await getArticleByID(articleID)

     const loading = document.querySelector("#loading-container");
     const breadcumbSpan = document.querySelector("#breadcumb span");
     const articleTitle = document.querySelector("#article-title");
     const articleBody = document.querySelector("#article-body");

     loading.style.display = "none";

     document.title = articleDetails.title;
     breadcumbSpan.innerHTML = articleDetails.title;
     articleTitle.innerHTML = articleDetails.title;
     articleBody.innerHTML = articleDetails.body;
     console.log(articleDetails);
})