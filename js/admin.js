const API_URL = "http://localhost:3002/books";

const booksTableBody = document.getElementById("booksTableBody");

const modal = document.getElementById("bookModal");

const openModalBtn = document.getElementById("openModalBtn");

const closeModalBtn = document.getElementById("closeModalBtn");

const bookForm = document.getElementById("bookForm");

const loader = document.getElementById("loader");

let isEditMode = false;

/* ================= SHOW LOADER ================= */

function showLoader(){
  loader.classList.add("active");
}

function hideLoader(){
  loader.classList.remove("active");
}

/* ================= OPEN MODAL ================= */

openModalBtn.addEventListener("click", () => {

  isEditMode = false;

  document.getElementById("modalTitle").innerText =
  "Ajouter un livre";

  bookForm.reset();

  document.getElementById("bookId").value = "";

  modal.classList.add("active");

});

/* ================= CLOSE MODAL ================= */

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

/* ================= FETCH BOOKS ================= */

async function fetchBooks(){

  showLoader();

  try{

    const response = await fetch(API_URL);

    if(!response.ok){
      throw new Error("Erreur lors du chargement");
    }

    const books = await response.json();

    displayBooks(books);

  }

  catch(error){

    console.error(error);

    booksTableBody.innerHTML = `
      <tr>
        <td colspan="7">
          Impossible de charger les livres
        </td>
      </tr>
    `;

  }

  finally{
    hideLoader();
  }

}

/* ================= DISPLAY BOOKS ================= */

function displayBooks(books){

  booksTableBody.innerHTML = "";

  books.forEach(book => {

    booksTableBody.innerHTML += `

      <tr>

        <td>${book.id}</td>

        <td>
          <img src="${book.couverture}"
          class="book-cover"/>
        </td>

        <td>${book.titre}</td>

        <td>${book.auteur}</td>

        <td>${book.genre}</td>

        <td>
          <span class="status ${book.aLire ? "yes" : "no"}">
            ${book.aLire ? "Oui" : "Non"}
          </span>
        </td>

        <td>

          <div class="actions">

            <button class="edit-btn"
            onclick="editBook(${book.id})">

              <i class="fa-solid fa-pen"></i>

            </button>

            <button class="delete-btn"
            onclick="deleteBook(${book.id})">

              <i class="fa-solid fa-trash"></i>

            </button>

          </div>

        </td>

      </tr>

    `;

  });

}

/* ================= ADD / UPDATE BOOK ================= */

bookForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const id =
  document.getElementById("bookId").value;

  const newBook = {
     id: Date.now(),

    titre:
    document.getElementById("title").value,

    auteur:
    document.getElementById("author").value,

    genre:
    document.getElementById("genre").value,

    description:
    document.getElementById("description").value,

    couverture:
    document.getElementById("cover").value,

    aLire:
    document.getElementById("aLire").checked

  };

  try{

    if(isEditMode){
        id: isEditMode
  ? Number(id)
  : Date.now(),

      await fetch(`${API_URL}/${id}`,{

        method:"PATCH",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify(newBook)

      });

    }

    else{

      await fetch(API_URL,{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify(newBook)

      });

    }

    modal.classList.remove("active");

    fetchBooks();

  }

  catch(error){

    console.error(error);

    alert("Erreur réseau");

  }

});

/* ================= EDIT BOOK ================= */

async function editBook(id){

  try{

    const response = await fetch(`${API_URL}/${id}`);

    const book = await response.json();

    isEditMode = true;

    document.getElementById("modalTitle").innerText =
    "Modifier le livre";

    document.getElementById("bookId").value = book.id;

    document.getElementById("title").value = book.titre;

    document.getElementById("author").value = book.auteur;

    document.getElementById("genre").value = book.genre;

    document.getElementById("description").value =
    book.description;

    document.getElementById("cover").value =
    book.couverture;

    document.getElementById("aLire").checked =
    book.aLire;

    modal.classList.add("active");

  }

  catch(error){

    console.error(error);

  }

}

/* ================= DELETE BOOK ================= */

async function deleteBook(id){

  const confirmation = confirm(
    "Voulez-vous supprimer ce livre ?"
  );

  if(!confirmation) return;

  try{

    await fetch(`${API_URL}/${id}`,{

      method:"DELETE"

    });

    fetchBooks();

  }

  catch(error){

    console.error(error);

    alert("Erreur suppression");

  }

}

/* ================= INIT ================= */

fetchBooks();

const cancelBtn = document.getElementById("cancelBtn");

cancelBtn.addEventListener("click", () => {

  modal.classList.remove("active");

});