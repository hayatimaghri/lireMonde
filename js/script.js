const ULR_API="http://localhost:3000/books";


async function fetchBooks() {
  try {
    const res = await fetch(ULR_API);
    if (!res.ok) throw new Error("Erreur serveur");
   const books = await res.json();
   renderBooks(books);
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

            <button>${book.genre}</button>

        </div>

        `;
    })
}
fetchBooks() ;