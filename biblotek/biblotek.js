/*
 * @Author: MoS 
 * @Date: 2025-10-03 11:06:57 
 * @Last Modified by: MoS
 * @Last Modified time: 2025-10-03 11:58:55
 */


const booksResults = document.getElementById("booksResults")
const searchInput = document.getElementById("search")

if(searchInput == ""){
    searchInput.textContent = "Frogs"
} else {
    
}


const googleBooksAPI = `https://www.googleapis.com/books/v1/volumes?q=${}frogs&maxResults=5&startIndex=10`