const ULR_API="http://localhost:3000/books";

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
            <img src="${book.couverture}" alt="${book.titre}">

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
  if (e.target.classList.contains("genre-btn")) {
    
    const id = e.target.dataset.id;

    const res = await fetch(`${ULR_API}/${id}`);
    const book = await res.json();

    openModal(book);
  }
});

document.getElementById("closeModal").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
};

