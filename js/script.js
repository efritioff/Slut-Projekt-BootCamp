/*
 * Author: Elias o MoS 
 * @Date: 2025-10-03 10:22:34 
 * Last Modified by:  Elias o MoS 
 * @Last Modified time: 2025-10-03 10:22:34 
 */

/* 
Pasted från biblo.js 2025-10-07 14:06 */

console.log("Project Elmo\n============")
console.log("script.js loaded");
/* 
const apikey = "AIzaSyDBIO4OfNn2JsHWIklCuiLqCHVLre-jOck" */

const booksResults = document.getElementById("booksResults")
const searchInput = document.getElementById("search")
const searchBtn = document.getElementById("startTheSearch")
const searchResult = document.getElementById("searchResult")
const myLibraryList = document.getElementById('myLibraryList')

const hero = document.getElementById("hero")
const main = document.getElementById("main")
/* 
Skipp Script Menu

//Meny script. klistrat in från reservera.js 2025-10-08 09:09
const menuOpen = doc.querySelector(".menu");
const menuClose = doc.querySelector(".close");
const overlay = doc.querySelector(".overlay");

menuOpen.addEventListener("click", () => {
  overlay.classList.add("overlay--active");
});

menuClose.addEventListener("click", () => {
  overlay.classList.remove("overlay--active");
});
//Meny script. klistrat in från reservera.js 2025-10-08 09:09 */

// Startar sökning (endast om sök-element finns på sidan)
if (searchInput && searchBtn && booksResults && searchResult) {
    //validera: om tom? håll det tomt
    if (searchInput.value.trim() === "") {
        searchInput.value = ""
    }

    // Startar sökning
    searchBtn.addEventListener("click", async() => {
        searchInput.value = searchInput.value
        console.log("Sök klickad")

        //Tömmer gamla resultat av böcker
        booksResults.innerHTML = ""

        // Kör API functionen vid klick
        await GoogleBooksAPI()
    })
}
    // Tryck på Enter i input-fältet
    searchInput.addEventListener("keydown", async (enterKey) => {
    if (enterKey.key === "Enter") {
        enterKey.preventDefault() 
        console.log("Enter tryckt")

        booksResults.innerHTML = ""
        
        await GoogleBooksAPI()
    }
    })

async function GoogleBooksAPI () {
    const query2google = searchInput.value.trim()
    const getGoogleBooksAPI = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query2google)}&maxResults=8&startIndex=30`)
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

                // Reserve button
                const reserveBtn = document.createElement('button')
                reserveBtn.className = 'book-btn'
                reserveBtn.type = 'button'
                // use Google book id as identifier
                const bookId = book.id
                reserveBtn.dataset.bookId = bookId
                reserveBtn.textContent = isBookReserved(bookId) ? 'Reserverad' : 'Reservera'
                if (isBookReserved(bookId)) reserveBtn.disabled = true

                reserveBtn.addEventListener('click', () => {
                    reserveBook({
                        id: bookId,
                        title: book.volumeInfo.title,
                        authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Okänd',
                        img: book.volumeInfo.imageLinks?.thumbnail || ''
                    })
                    reserveBtn.textContent = 'Reserverad'
                    reserveBtn.disabled = true
                    renderMyLibrary()
                })

    bookHolder.appendChild(bookTitle)
    bookHolder.appendChild(bookPublish)
    bookHolder.appendChild(bookImg)
    bookHolder.appendChild(bookDesc)
    bookHolder.appendChild(reserveBtn)

        searchResult.appendChild(searchText)
        booksResults.appendChild(bookHolder)
    }
    
   /*  //Ska nollställa input
    searchInput.value = ""
 */
    //Ska nollställa id main och hero
  /* // Skippar hero för att jag använder background image
    hero.innerHTML = "" */
   /*  main.innerHTML = "" */
}

// Reservation storage: save as { id, title, authors, img, expires }
function getReservations() {
    try {
        const raw = localStorage.getItem('reservations')
        if (!raw) return []
        const parsed = JSON.parse(raw)
        // filter out expired
        const now = Date.now()
        const active = parsed.filter(r => r.expires > now)
        if (active.length !== parsed.length) {
            localStorage.setItem('reservations', JSON.stringify(active))
        }
        return active
    } catch (e) {
        console.error('Error reading reservations', e)
        return []
    }
}

function isBookReserved(bookId) {
    return getReservations().some(r => r.id === bookId)
}

function reserveBook(book) {
    const reservations = getReservations()
    const expires = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    reservations.push({ ...book, expires })
    localStorage.setItem('reservations', JSON.stringify(reservations))
}

function renderMyLibrary() {
    if (!myLibraryList) return
    const res = getReservations()
    myLibraryList.innerHTML = ''
    if (res.length === 0) {
        myLibraryList.textContent = 'Du har inga reserverade böcker.'
        return
    }
    for (const r of res) {
        const el = document.createElement('div')
        el.className = 'bookHolder'
        el.innerHTML = `
            <h3 class="bookTitle">${r.title}</h3>
            <p class="bookPublish">${r.authors}</p>
            ${r.img ? `<img class="bookImg" src="${r.img}" alt="${r.title}">` : ''}
            <p class="bookDesc">Reserverad till: ${new Date(r.expires).toLocaleString()}</p>
        `

        // Avboka-knapp
        const cancelBtn = document.createElement('button')
        cancelBtn.className = 'cancel-btn'
        cancelBtn.type = 'button'
        cancelBtn.textContent = 'Avboka'
        cancelBtn.addEventListener('click', () => {
            cancelReservation(r.id)
        })

        el.appendChild(cancelBtn)
        myLibraryList.appendChild(el)
    }
}

function cancelReservation(bookId) {
    const reservations = getReservations()
    const filtered = reservations.filter(r => r.id !== bookId)
    localStorage.setItem('reservations', JSON.stringify(filtered))
    // enable reserve button if present in search results
    const reserveBtn = document.querySelector(`button.book-btn[data-book-id="${bookId}"]`)
    if (reserveBtn) {
        reserveBtn.disabled = false
        reserveBtn.textContent = 'Reservera'
    }
    renderMyLibrary()
}

// Initial render of library
renderMyLibrary()

// Anropa GoogleBooksAPI endast om sökfält finns (annars visas bara biblioteket)
if (!searchInput && searchBtn) {
    GoogleBooksAPI()
}