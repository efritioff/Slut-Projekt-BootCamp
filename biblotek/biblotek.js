/*
 * @Author: MoS 
 * @Date: 2025-10-03 11:06:57 
 * @Last Modified by: MoS
 * @Last Modified time: 2025-10-06 11:45:40
 */

console.log("Project Elmo\n============")

/* 
const apikey = "AIzaSyDBIO4OfNn2JsHWIklCuiLqCHVLre-jOck" */

const booksResults = document.getElementById("booksResults")
const searchInput = document.getElementById("search")
const searchBtn = document.getElementById("startTheSearch")

//validerar: om tom? sök efter "frogs"
if (searchInput.value.trim() === "") {
    searchInput.value = "Frogs"
} 

// Startar sökning
searchBtn.addEventListener("click", async() => {
    searchInput.value = searchInput.value
    console.log("Klick")

    //Tömmer gamla resultat
    booksResults.innerHTML = ""
    
    // Bör köra API functionen vid klick
    await GoogleBooksAPI()

}
)

async function GoogleBooksAPI () {
    const query2google = searchInput.value.trim()
    const getGoogleBooksAPI = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query2google)}&maxResults=12&startIndex=24`)
    const GoogleBooksData = await getGoogleBooksAPI.json()
 console.log(query2google)
    //Testar att printa namnet på första Item
    //console.log(GoogleBooksData.items[0].volumeInfo.title)

    for (let book of GoogleBooksData.items) {

        const bookHolder = document.createElement("div")
        bookHolder.classList.add("bookHolder")
        
        const bookImg = document.createElement("img")
        bookImg.src = book.volumeInfo.imageLinks.thumbnail
        bookImg.alt = `Denna bok heter ${book.volumeInfo.title}`

        const bookTitle = document.createElement("h3")
        bookTitle.classList.add("bookTitle")
        bookTitle.textContent = book.volumeInfo.title

        const bookDesc = document.createElement("p")
        bookDesc.classList.add("bookDesc")
        bookDesc.textContent = `Sneekpeek: ${book.volumeInfo.description}`

        const bookPublish = document.createElement("p")
        bookPublish.classList.add("bookPublish")
        bookPublish.textContent = `Publicerad: ${book.volumeInfo.publishedDate}`

        bookHolder.appendChild(bookTitle)
        bookHolder.appendChild(bookPublish)
        bookHolder.appendChild(bookImg)
        bookHolder.appendChild(bookDesc)

        booksResults.appendChild(bookHolder)
    }
    
    //Ska nollställa input
    searchInput.value = ""
}

//Anropar functionen
GoogleBooksAPI()