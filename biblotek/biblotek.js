/*
 * @Author: MoS 
 * @Date: 2025-10-03 11:06:57 
 * @Last Modified by: MoS
 * @Last Modified time: 2025-10-06 08:10:17
 */

const apikey = "AIzaSyDBIO4OfNn2JsHWIklCuiLqCHVLre-jOck"

const booksResults = document.getElementById("booksResults")
const searchInput = document.getElementById("search")

//validerar: om tom? sök efter "frogs"
if(searchInput === ""){
    startQuery.textContent = "Frogs"
}

async function GoogleBooksAPI () {
    const getGoogleBooksAPI = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}&maxResults=10&startIndex=20`)
    const GoogleBooksData = await getGoogleBooksAPI.json()
 
    //Testar att printa namnet på första Item
    //console.log(GoogleBooksData.items[0].volumeInfo.title)

    for (let book of GoogleBooksData.items) {

        const bookHolder = document.createElement("div")
        bookHolder.classList.add("bookHolder")
        
        const bookImg = document.createElement("img")
        bookImg.src = book.volumeInfo.imageLinks.thumbnail
        bookImg.alt = `Denna bok heter ${book.volumeInfo.title}`


        const bookTitle = document.createElement("p")
        bookTitle.classList.add("bookTitle")
        bookTitle.textContent = book.volumeInfo.title

        bookHolder.appendChild(bookImg)
        bookHolder.appendChild(bookTitle)

        booksResults.appendChild(bookHolder)
    }
}

//Anropar functionen
GoogleBooksAPI()