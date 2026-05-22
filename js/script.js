const ULR_API="http://localhost:3002/books";
let allBooks = [];

async function fetchBooks() {
  try {
    const res = await fetch(ULR_API);
    if (!res.ok) throw new Error("Erreur serveur");
   const books = await res.json();
   renderBooks(books);
   allBooks = books; 
  } catch (err) {
    console.log("Impossible de charger les commandes", "error");
  }
}

function renderBooks(books){
    const livres=document.getElementById('livres');
    livres.innerHTML="";
    books.forEach(book=>{
        livres.innerHTML +=`
       <div class="card">
           <img src="${book.couverture}" alt="${book.titre}" data-id="${book.id}"  class="book-img">

            <h3>${book.titre}</h3>

            <p>${book.auteur}</p>

           <button class="genre-btn" data-id="${book.id}"> ${book.genre}</button>

        </div>

        `;
    })
}
fetchBooks() ;
// modal

function openModal(book){
  document.getElementById("modal").classList.remove("hidden");

  document.getElementById("modalImg").src = book.couverture;
  document.getElementById("modalTitle").textContent = book.titre;
  document.getElementById("modalAuthor").textContent = book.auteur;
  document.getElementById("modalGenre").textContent = book.genre;
  document.getElementById("modalDesc").textContent = book.description;
}

document.getElementById("livres").addEventListener("click", async (e) => {

  if (!e.target.classList.contains("book-img")) return;

  const id = e.target.dataset.id;

  const res = await fetch(`${ULR_API}/${id}`);

  const book = await res.json();

  openModal(book);

});

document.getElementById("closeModal").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
};

// catégories
function filterBooks() {
  const value = document.getElementById("select").value;

  if (value === "tous") {
    renderBooks(allBooks);
    return;
  }

  const filtered = allBooks.filter(book =>
    book.genre.toLowerCase() === value.toLowerCase()
  );

  renderBooks(filtered);
}
document.getElementById("select").addEventListener("change", filterBooks);

// searchInput
function searchInput(){

    const value = document.getElementById("searchInput")
    .value
    .toLowerCase();

    const filtered = allBooks.filter(book =>
        book.titre.toLowerCase().includes(value)
    );

    renderBooks(filtered);
}

document.getElementById("searchInput")
.addEventListener("input", searchInput);



let listeLire = [];

document.getElementById("btnLire").addEventListener("click", () => {

  const titre = document.getElementById("modalTitle").textContent;

  const book = allBooks.find(book => book.titre === titre);

  const existe = listeLire.find(item => item.id === book.id);

  if(existe) return;

  listeLire.push(book);

  afficherListeLire();

});


function afficherListeLire(){

  const container = document.getElementById("livresLire");

  container.innerHTML = "";

  listeLire.forEach(book => {

    container.innerHTML += `

      <div class="card-lire">

        <img src="${book.couverture}" alt="${book.titre}">

        <h3>${book.titre}</h3>

        <p>${book.auteur}</p>

        <button class="supprimer-btn" data-id="${book.id}">
          Supprimer
        </button>

      </div>

    `;
  });

  document.querySelectorAll(".supprimer-btn").forEach(btn => {

    btn.addEventListener("click", () => {

      const id = btn.dataset.id;

      listeLire = listeLire.filter(book => book.id != id);

      afficherListeLire();

    });

  });

}