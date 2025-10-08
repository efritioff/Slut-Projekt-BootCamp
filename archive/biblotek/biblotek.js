/*
 * @Author: MoS 
 * @Date: 2025-10-03 11:06:57 
 * @Last Modified by: MoS
 * @Last Modified time: 2025-10-06 14:23:54
 */

console.log("Project Elmo\n============")

/* 
const apikey = "AIzaSyDBIO4OfNn2JsHWIklCuiLqCHVLre-jOck" */

const booksResults = document.getElementById("booksResults")
const searchInput = document.getElementById("search")
const searchBtn = document.getElementById("startTheSearch")
const searchResult = document.getElementById("searchResult")

//validerar: om tom? sök efter "frogs"
if (searchInput.value.trim() === "") {
    searchInput.value = ""
} 

// Startar sökning
searchBtn.addEventListener("click", async() => {
    searchInput.value = searchInput.value
    console.log("Klick")

    //Tömmer gamla resultat av böcker
    booksResults.innerHTML = ""
   
    
    // Bör köra API functionen vid klick
    await GoogleBooksAPI()

}
)

async function GoogleBooksAPI () {
    const query2google = searchInput.value.trim()
    const getGoogleBooksAPI = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query2google)}&maxResults=30&startIndex=30`)
    const GoogleBooksData = await getGoogleBooksAPI.json()
 
    if(searchResult === ""){
    //Tömmer gamla resultat
    } 
    searchResult.innerHTML = ""
    const searchText = document.createElement("h2")
    searchText.classList.add("searchText")
    searchText.textContent = `Detta är ditt resultat för din sökning: ${query2google}`
    
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
        bookDesc.textContent = `Description: ${book.volumeInfo.description}`

        const bookPublish = document.createElement("p")
        bookPublish.classList.add("bookPublish")
        bookPublish.textContent = `Publicerad: ${book.volumeInfo.publishedDate}`

        bookHolder.appendChild(bookTitle)
        bookHolder.appendChild(bookPublish)
        bookHolder.appendChild(bookImg)
        bookHolder.appendChild(bookDesc)

        searchResult.appendChild(searchText)
        booksResults.appendChild(bookHolder)
    }
    
   /*  //Ska nollställa input
    searchInput.value = ""
 */
}

//Anropar functionen
GoogleBooksAPI()