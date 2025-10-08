/*
 * @Author: MoS 
 * @Date: 2025-10-03 11:06:57 
 * @Last Modified by: elias.fritioff
 * @Last Modified time: 2025-10-08 11:12:41
 */

console.log("Project Elmo\n============")
console.log("biblotek.js loaded");
/* 
const apikey = "AIzaSyDBIO4OfNn2JsHWIklCuiLqCHVLre-jOck" */

const booksResults = document.getElementById("booksResults")
const searchInput = document.getElementById("search")
const searchBtn = document.getElementById("startTheSearch")
const searchResult = document.getElementById("searchResult")
const myLibraryList = document.getElementById('myLibraryList')

// Startar sökning (endast om sök-element finns på sidan)
if (searchInput && searchBtn && booksResults && searchResult) {
    //validera: om tom? håll det tomt
    if (searchInput.value.trim() === "") {
        searchInput.value = ""
    }

    // Startar sökning
    searchBtn.addEventListener("click", async() => {
        searchInput.value = searchInput.value
        console.log("Klick")

        //Tömmer gamla resultat av böcker
        booksResults.innerHTML = ""

        // Kör API functionen vid klick
        await GoogleBooksAPI()
    })
}

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
                    // Kontrollera om användaren är inloggad; om inte, redirect till login
                    const _loggedInEmail = localStorage.getItem('loggedInUserEmail')
                    if (!_loggedInEmail) {
                        window.location.href = '/pages/login.html'
                        return
                    }

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
if (searchInput && searchBtn) {
    GoogleBooksAPI()
}