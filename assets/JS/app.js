const cl = console.log;

const userForm = document.getElementById("userForm");
const title = document.getElementById("title");
const body = document.getElementById("body");
const userId = document.getElementById("userId");
const addBtnn = document.getElementById("addbt");
const updatBtn = document.getElementById("updatId");
const cardContaier = document.getElementById("cardContaier");

const spinner = document.getElementById("spinner");

let postArr = [];

let baseURl = "https://jsonplaceholder.typicode.com";

function snackbar(msg, icon) {
  swal.fire({
    title: msg,
    icon: icon,
    timer: 2000,
  });
}

function fetchPost() {
  let xhr = new XMLHttpRequest();
  let postURL = `${baseURl}/posts`;
  xhr.open("GET", postURL);
  xhr.send();
  xhr.onload = function () {
    postArr = JSON.parse(xhr.response);
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
    creatPost(postArr);
  };
}

fetchPost();

function creatPost(eve) {
  let result = "";
  eve.forEach((element) => {
    result += `
    <div class="col-md-4 my-2  " id=${element.id}>
            <div class="card h-100 ">
            <div class="card-header" data-toggle="tooltip" data-placement="top" title="${element.title}">
              <h2>${element.title}</h2>
            </div>
            <div class="card-body">
              <p>${element.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button class="btn btn-warning btn-sm"  id="edit" onclick="onEdit(this)">Edit</button>
              <button class="btn btn-danger btn-sm"  id="delete" onclick="onRemove(this)">Delete</button>
            </div>
          </div>
        </div>
        </div>
    `;
  });

  cardContaier.innerHTML = result;
}

function onSubmitHandalar(eve) {
  eve.preventDefault();

  spinner.classList.remove("d-none");

  let newObj = {
    userid: userId.value,
    title: title.value,
    body: body.value,
  };

  let xhr = new XMLHttpRequest();
  let postURL = `${baseURl}/posts`;
  xhr.open("POST", postURL);
  xhr.send(JSON.stringify(newObj));

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let response = JSON.parse(xhr.response);
      let div = document.createElement("div");
      div.className = "col-md-4 my-2";
      div.id = response.id;

      div.innerHTML = `
       <div class="card shadow-lg  h-100">
            <div class="card-header" data-toggle="tooltip" data-placement="top" title="${newObj.title}">
              <h2>${newObj.title}</h2>
            </div>
            <div class="card-body">
              <p>${newObj.body}</p>
            </div>
             <div class="card-footer d-flex justify-content-between">
              <button class="btn btn-warning btn-sm"  id="edit" onclick="onEdit(this)">Edit</button>
              <button class="btn btn-danger btn-sm"  id="delete" onclick="onRemove(this)">Delete</button>
            </div>
            </div>
      `;

      cardContaier.prepend(div);
      userForm.reset();
    }
    snackbar("New Post Add Successfully", "success");
    spinner.classList.add("d-none");
  };
}

//

function onEdit(ele) {
  spinner.classList.remove("d-none");

  let editId = ele.closest(".col-md-4").id;
  localStorage.setItem("editId", editId);

  let editURL = `${baseURl}/posts/${editId}`;

  let xhr = new XMLHttpRequest();
  xhr.open("GET", editURL);
  xhr.send();

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let editObj = JSON.parse(xhr.response);

      userForm.classList.remove("d-none");

      title.value = editObj.title;
      body.value = editObj.body;
      userId.value = editObj.userId;

      addBtnn.classList.add("d-none");
      updatBtn.classList.remove("d-none");

      userForm.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    spinner.classList.add("d-none");
  };
}

function updateBtn(ele) {
  spinner.classList.remove("d-none");

  let updateId = localStorage.getItem("editId");
  let updateObj = {
    userId: userId.value,
    title: title.value,
    body: body.value,
    id: updateId,
  };

  let updUrl = `${baseURl}/posts/${updateId}`;
  let xhr = new XMLHttpRequest();
  xhr.open("PUT", updUrl);
  xhr.send(JSON.stringify(updateObj));

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let div = document.getElementById(updateId);

      div.innerHTML = `
      <div class="card shadow-lg h-100 ">
      <div class="card-header" data-toggle="tooltip" data-placement="top" title="${updateObj.title}">
        <h2>${updateObj.title}</h2>
      </div>
      <div class="card-body">
        <p>${updateObj.body}</p>
      </div>
       <div class="card-footer d-flex justify-content-between">
        <button class="btn btn-warning btn-sm"  id="edit" onclick="onEdit(this)">Edit</button>
        <button class="btn btn-danger btn-sm"  id="delete" onclick="onRemove(this)">Delete</button>
      </div>
      </div>
      `;

      addBtnn.classList.remove("d-none");
      updatBtn.classList.add("d-none");
      div.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      div.classList.add("highlight");

      setTimeout((highlight) => {
        div.classList.remove("highlight");
      }, 3000);
    } else {
      snackbar("something wents wrong", "error");
    }
  };
  spinner.classList.add("d-none");
  snackbar("Post Update Successfully", "success");

  userForm.reset();
}

function onRemove(ele) {
  let removeId = ele.closest(".col-md-4").id;

  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete it!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      spinner.classList.remove("d-none");

      let removeUrl = `${baseURl}/posts/${removeId}`;

      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", removeUrl);
      xhr.send(null);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
          ele.closest(".col-md-4").remove();
          spinner.classList.add("d-none");
          snackbar("Post delete successfully", "success");
        }
      };
    } else {
      snackbar("something wents wrong", "error");
    }
  });
}

userForm.addEventListener("submit", onSubmitHandalar);
updatBtn.addEventListener("click", updateBtn);
