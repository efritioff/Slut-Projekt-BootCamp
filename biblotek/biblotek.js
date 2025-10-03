/*
 * @Author: MoS 
 * @Date: 2025-10-03 11:06:57 
 * @Last Modified by: MoS
 * @Last Modified time: 2025-10-03 15:47:18
 */

const apikey = "AIzaSyDBIO4OfNn2JsHWIklCuiLqCHVLre-jOck"

const booksResults = document.getElementById("booksResults")
const searchInput = document.getElementById("search")

//validerar: om tom? sök efter "frogs"
if(searchInput == ""){
    const startQuery = "Frogs"
}

async function GoogleBooksAPI () {
    const getGoogleBooksAPI = await fetch(`https://www.googleapis.com/books/v1/volumes?q=frogs&maxResults=5&startIndex=10`)
    const GoogleBooksData = await getGoogleBooksAPI.json()
 
    //Testar att printa namnet på första Item
    //console.log(GoogleBooksData.items[0].volumeInfo.title)

    for (let book of GoogleBooksData.items) {
        const bookTitle = document.createElement("p")
        bookTitle.classList.add("bookTitle")
        bookTitle.textContent = volumeInfo.title

        booksResults.appendChild(bookTitle)
    }
}

//Anropar functionen
GoogleBooksAPI()