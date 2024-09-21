import { baseUrl } from "../../../utils/shared.js";
import { getToken } from "../../../utils/utils.js"

window.addEventListener('load', async () => {
     const token = getToken()

     const articlesCount = document.querySelector("#articles-count");
     const postsCount = document.querySelector("#posts-count");
     const usersCount = document.querySelector("#users-count");
     const postsTable = document.querySelector("#posts-table");
     const usersTable = document.querySelector("#users-table");
     
     alert('ما نمی تونیم به پنل دسترسی داشته باشیم، فقط استاد می تونه!')
     
     const res = await axios({
          url: `${baseUrl}/v1/dashboard`,
          headers: {
               Authorization: `Bearer ${token}`
          }
     })

     articlesCount.innerHTML = res.data.articlesCount;
     postsCount.innerHTML = res.data.postsCount;
     usersCount.innerHTML = res.data.usersCount;

     res.data.users.forEach((user) => {
          usersTable.insertAdjacentHTML(
               "beforeend",
               `
          <tr>
            <td>${user.phone}</td>
            <td>${user.verified ? "تایید شده" : "تایید نشده"}</td>
            <td>${user.postsCount}</td>
          </tr>
      `
          );
     });

     if (res.data.posts.length) {
          res.data.posts.forEach((post) => {
               postsTable.insertAdjacentHTML(
                    "beforeend",
                    `
            <tr>
              <td>${post.title}</td>
              <td>${post.creator.phone}</td>
              <td>${post.category.title}</td>
            </tr>
        `
               );
          });
     } else {
          postsTable.innerHTML = '<p class="empty-title">هیچ آگهی‌ای موجود نیست</p>';
     }
})