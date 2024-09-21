import { baseUrl, getAllLocations } from '../../../utils/shared.js'
import { getToken, getURLParam } from '../../../utils/utils.js'
window.addEventListener('load', async () => {
     const subCatID = getURLParam('subCategoryID')
     const catTitle = document.querySelector('.category_details p')
     const dynamicFields = document.querySelector("#dynamic-fields");
     const uploader = document.querySelector("#uploader");
     const imagesContainer = document.querySelector("#images-container");

     const registerBtn = document.querySelector("#register-btn");
     const citySelectBox = document.querySelector("#city-select");
     const neighborhoodSelectBox = document.querySelector("#neighborhood-select");
     const res = await axios({ url: `${baseUrl}/v1/category/sub` });
     const response = await res.data.data
     const categories = await response.categories
     const subCategory = categories.find(cat => cat._id === subCatID)
     const postTitleInput = document.querySelector("#post-title-input");
     const postPriceInput = document.querySelector("#post-price-input");
     const exchangeCheckbox = document.querySelector("#exchange-checkbox");
     const postDescriptionTextarea = document.querySelector("#post-description-textarea");

     let mapView = { x: 35.715298, y: 51.404343 };
     let markerIcon = null;
     let iconStatus = "FIRST_ICON";
     let pics = []
     const categoryFields = {}
     const token = getToken();

     // ------------------------ Map Handling ------------------------
     let map = L.map("map").setView([35.715298, 51.404343], 13);
     let firstIcon = L.icon({
          iconUrl:
               "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNyA0OCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbi1hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E2MjYyNiIgc3RvcC1vcGFjaXR5PSIuMzIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQTYyNjI2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9InBpbi1jIiBkPSJNMTguNzk0MzMzMywxNC40NjA0IEMxOC43OTQzMzMzLDE3LjQwNTQ1OTkgMTYuNDA3NDQ5NiwxOS43OTM3MzMzIDEzLjQ2MDEwNDcsMTkuNzkzNzMzMyBDMTAuNTE0NTUwNCwxOS43OTM3MzMzIDguMTI3NjY2NjcsMTcuNDA1NDU5OSA4LjEyNzY2NjY3LDE0LjQ2MDQgQzguMTI3NjY2NjcsMTEuNTE1MzQwMSAxMC41MTQ1NTA0LDkuMTI3MDY2NjcgMTMuNDYwMTA0Nyw5LjEyNzA2NjY3IEMxNi40MDc0NDk2LDkuMTI3MDY2NjcgMTguNzk0MzMzMywxMS41MTUzNDAxIDE4Ljc5NDMzMzMsMTQuNDYwNCIvPgogICAgPGZpbHRlciBpZD0icGluLWIiIHdpZHRoPSIyMzEuMiUiIGhlaWdodD0iMjMxLjIlIiB4PSItNjUuNiUiIHk9Ii00Ni45JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMiIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjQgMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Bpbi1hKSIgZD0iTTEzLjA3MzcsMS4wMDUxIEM1LjgwMzIsMS4yMTUxIC0wLjEzOTgsNy40Njg2IDAuMDAyNywxNC43MzkxIEMwLjEwOTIsMjAuMTkwMSAzLjQ1NTcsMjQuODQ2MSA4LjE5NTcsMjYuODYzNiBDMTAuNDUzMiwyNy44MjUxIDExLjk3MTIsMjkuOTc0NiAxMS45NzEyLDMyLjQyODYgTDExLjk3MTIsMzkuNDExNTUxNCBDMTEuOTcxMiw0MC4yMzk1NTE0IDEyLjY0MTcsNDAuOTExNTUxNCAxMy40NzEyLDQwLjkxMTU1MTQgQzE0LjI5OTIsNDAuOTExNTUxNCAxNC45NzEyLDQwLjIzOTU1MTQgMTQuOTcxMiwzOS40MTE1NTE0IEwxNC45NzEyLDMyLjQyNTYgQzE0Ljk3MTIsMzAuMDEyMSAxNi40MTcyLDI3LjgzNDEgMTguNjQ0NywyNi45MDU2IEMyMy41MTY3LDI0Ljg3NzYgMjYuOTQxMiwyMC4wNzYxIDI2Ljk0MTIsMTQuNDcwNiBDMjYuOTQxMiw2Ljg5ODYgMjAuNjkzNywwLjc4NjEgMTMuMDczNywxLjAwNTEgWiIvPgogICAgPHBhdGggZmlsbD0iI0E2MjYyNiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuNDcwNiw0Ny44MTIgQzEyLjU1NTYsNDcuODEyIDExLjgxNDYsNDcuMDcxIDExLjgxNDYsNDYuMTU2IEMxMS44MTQ2LDQ1LjI0MSAxMi41NTU2LDQ0LjUgMTMuNDcwNiw0NC41IEMxNC4zODU2LDQ0LjUgMTUuMTI2Niw0NS4yNDEgMTUuMTI2Niw0Ni4xNTYgQzE1LjEyNjYsNDcuMDcxIDE0LjM4NTYsNDcuODEyIDEzLjQ3MDYsNDcuODEyIFoiLz4KICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI3Bpbi1iKSIgeGxpbms6aHJlZj0iI3Bpbi1jIi8+CiAgICA8dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNwaW4tYyIvPgogIDwvZz4KPC9zdmc+Cg==",
          iconSize: [30, 30],
     });
     let secondIcon = L.icon({
          iconUrl:
               "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNSA0OUMxMS44IDQ5IDEgMzguMiAxIDI1QzEgMTEuOCAxMS44IDEgMjUgMUMzOC4yIDEgNDkgMTEuOCA0OSAyNUM0OSAzOC4yIDM4LjIgNDkgMjUgNDlaTTI1IDUuOEMxNC40NCA1LjggNS44IDE0LjQ0IDUuOCAyNUM1LjggMzUuNTYgMTQuNDQgNDQuMiAyNSA0NC4yQzM1LjU2IDQ0LjIgNDQuMiAzNS41NiA0NC4yIDI1QzQ0LjIgMTQuNDQgMzUuNTYgNS44IDI1IDUuOFoiIGZpbGw9IiNBNjI2MjYiLz4KPHBhdGggZD0iTTI1IDM3QzE4LjQgMzcgMTMgMzEuNiAxMyAyNUMxMyAxOC40IDE4LjQgMTMgMjUgMTNDMzEuNiAxMyAzNyAxOC40IDM3IDI1QzM3IDMxLjYgMzEuNiAzNyAyNSAzN1oiIGZpbGw9IiNBNjI2MjYiLz4KPC9zdmc+Cg==",
          iconSize: [30, 30],
     });

     markerIcon = firstIcon

     let mapMarker = L.marker([35.71529, 51.40434], { icon: markerIcon }).addTo(map)

     map.on("move", () => {
          const center = map.getSize().divideBy(2)
          const targetPoint = map.containerPointToLayerPoint(center);
          const targetLating = map.layerPointToLatLng(targetPoint);

          mapMarker.setLatLng(targetLating);

          mapView = {
               x: targetLating.lat,
               y: targetLating.lng,
          };
     })

     L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18
     }).addTo(map)

     const mapIconControll = document.querySelector(".icon-controll");
     mapIconControll.addEventListener("change", (event) => {
          if (iconStatus === "FIRST_ICON") {
               markerIcon = secondIcon;
               mapMarker.setIcon(markerIcon);
               iconStatus = "SECOND_ICON";
          } else {
               markerIcon = firstIcon;
               mapMarker.setIcon(markerIcon);
               iconStatus = "FIRST_ICON";
          }
     });

     // ------------------------------------ Start Funcs ------------------------------------
     catTitle.innerHTML = subCategory.title

     subCategory.productFields.map(field => {
          dynamicFields.insertAdjacentHTML("beforeend", `
               ${field.type === "selectbox"
                    ? `
                       <div class="group">
                         <p class="field-title">${field.name}</p>
                         <div class="field-box">
                           <select required="required" onchange="fieldChangeHandler('${field.slug}', event.target.value)">
                             <option value="default">انتخاب</option>
                             ${field.options.map(
                         (option) =>
                              `<option value="${option}">${option}</option>`
                    )}
                           </select>
                           <svg>
                             <use xlink:href="#select-arrow-down"></use>
                           </svg>
                         </div>
                         <svg class="sprites">
                           <symbol id="select-arrow-down" viewbox="0 0 10 6">
                             <polyline points="1 1 5 5 9 1"></polyline>
                           </symbol>
                         </svg>
                       </div>
                     `
                    : `
                       <div class="group checkbox-group">
                         <input class="checkbox" type="checkbox" onchange="fieldChangeHandler('${field.slug}', event.target.checked)" />
                         <p>${field.name}</p>
                       </div>          
                     `
               }
             `)
     })

     subCategory.productFields.forEach(field => {
          if (field.type === 'checkbox') {
               categoryFields[field.slug] = false
          } else {
               categoryFields[field.slug] = null
          }
     })

     window.fieldChangeHandler = (slug, data) => {
          categoryFields[slug] = data
     }

     // // ------------------------ Upload Image ------------------------
     uploader.addEventListener("change", e => {
          if (e.target.files.length) {
               let file = e.target.files[0]

               // Size and Type Validation
               if ((file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') && file.size < 3_000_000 && pics.length < 20) {

                    pics.push(file)
                    generateImage(pics)
               } else {
                    if (file.size > 3_000_000) {
                         Swal.fire({
                              title: "سایز تصویر باید کمتر از 3 مگابایت باشد!!",
                              icon: 'error',
                              confirmButtonText: "تلاش مجدد"
                         })
                    } else if (pics.length >= 20) {
                         Swal.fire({
                              title: "تعداد تصاویر باید کمتر از 20 باشد!!",
                              icon: 'error',
                              confirmButtonText: "تلاش مجدد"
                         })
                    } else {
                         Swal.fire({
                              title: "فرمت فایل آپلودی مجاز نیست!",
                              icon: 'error',
                              confirmButtonText: "تلاش مجدد"
                         })
                    }
               }
          }
     })

     const generateImage = (pics) => {
          imagesContainer.innerHTML = ''

          pics.map(pic => {
               let reader = new FileReader()
               reader.onloadend = function () {
                    let src = reader.result
                    imagesContainer.insertAdjacentHTML('beforeend', `
                    <div class="image-box">
                         <div onclick="deleteImage('${pic.name}')">
                               <i class="bi bi-trash"></i>
                         </div>
                         <img src="${src}" alt="post-image" />
                    </div>     
                    `)
               }

               reader.readAsDataURL(pic)
          })
     }

     window.deleteImage = (picName) => {
          pics = pics.filter((pic) => pic.name !== picName);
          generateImage(pics);
     };

     // Choice
     getAllLocations().then(data => {
          const cityChoices = new Choices(citySelectBox)
          const neighborhoodChoices = new Choices(neighborhoodSelectBox)

          const neighborhoods = data.neighborhoods.filter(neighborhood => neighborhood.city_id === 301) // Tehran Code

          const choices = [
               {
                    value: 'default',
                    label: 'انتخاب محله',
                    disabled: true,
                    selected: true,
               },
               ...neighborhoods.map(neighborhood => ({ value: neighborhood.id, label: neighborhood.name })),
          ]

          neighborhoodChoices.setChoices(choices, "value", "label", false)

          cityChoices.setChoices(data.cities.map(city => ({
               value: city.id,
               label: city.name,
               customProperties: { id: city.id },
               selected: city.name === "تهران" ? true : false
          })), "value", "label", false)

          citySelectBox.addEventListener('addItem', e => {
               neighborhoodChoices.clearStore()
               const neighborhoods = data.neighborhoods.filter(neighborhood => neighborhood.city_id === e.detail.customProperties.id)

               if (neighborhoods.length) {
                    neighborhoodChoices.setChoices([
                         {
                              value: 'default',
                              label: 'انتخاب محله',
                              disabled: true,
                              selected: true,
                         },
                         ...neighborhoods.map(neighborhood => ({ value: neighborhood.id, label: neighborhood.name })),
                    ], "value", "label", false)

               } else {
                    neighborhoodChoices.setChoices([
                         {
                              value: 'default',
                              label: 'محله ای وجود نداره!',
                              disabled: false,
                              selected: true,
                         },
                    ], "value", "label", false)
               }
          })
     })

     registerBtn.addEventListener('click', async () => {
          // Validation
          let isAllFieldsField = true

          for (const catKey in categoryFields) {
               if (categoryFields[catKey] === null) {
                    isAllFieldsField = false
               }
          }

          if (!isAllFieldsField
               || neighborhoodSelectBox.value === "Defualt"
               || !postTitleInput.value.trim()
               || !postDescriptionTextarea.value.trim()
               || !postPriceInput.value.trim()
          ) {
               Swal.fire({
                    title: 'لطفاً تمامی ورودی هارا پر کنید!',
                    icon: 'error',
                    confirmButtonText: 'تلاش مجدد'
               })
          } else {
               const formData = new FormData()

               formData.append("city", citySelectBox.value)
               formData.append("neighborhood", neighborhoodSelectBox.value)
               formData.append("title", postTitleInput.value)
               formData.append("description", postDescriptionTextarea.value)
               formData.append("price", postPriceInput.value)
               formData.append("exchange", exchangeCheckbox.checked)
               formData.append("map", JSON.stringify(mapView))
               formData.append("categoryFields", JSON.stringify(categoryFields))

               pics.map(pic => {
                    formData.append("pics", pic)
               })

               const res = await axios({
                    url: `${baseUrl}/v1/post/${subCatID}`,
                    method: 'post',
                    headers: {
                         Authorization: `Bearer ${token}`
                    },
                    data: formData,
               })

               if (res.status === 201) {
                    Swal.fire({
                         title: 'آگهی شما با موفقیت به پشتیبانی دیوار ارسال شد',
                         icon: 'success',
                         confirmButtonText: 'حله'
                    }).then (() => location.reload())
               } else {
                    Swal.fire({
                         title: 'متاسفانه آگهی شما با موفقیت ارسال نشد!',
                         icon: 'error',
                         confirmButtonText: 'دوباره تلاش می کنم'
                    }).then (() => location.reload())
               }
          }
     })
})