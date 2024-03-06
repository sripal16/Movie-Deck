//1)first fetch the data of movies
//2)then render the movies 
//3)make sorting buttons functional
//4)do the pagination and add conditions in the fetch movies function
//5)implement search functionality using search api
//6)then implement the functionality for all and favourite tabs.
let movies = [];
let currentPage = 1;
const API_KEY = 'f531333d637d0c44abc85b3e74db2186';
const movieList = document.getElementById('movies-list');

//1)fetching the data of movies

async function fetchMovies(page) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`);
        const result = await response.json();
        movies = result.results;
        renderMovies(movies);
        //this is written after adding 
        //eventlisteners to prev and next buttons for pagination
        //this is written here because for every click on 
        //prev and next buttons we are calling fetchMovies.
        //initially i have not added this here.
        //first add events to prev and next then write this here.
        if (currentPage == 1) {
            prevButton.disabled = true;
        }
        else {
            prevButton.disabled = false;
        }
        if (currentPage == 4) {
            nextButton.disabled = true;
        }
        else {
            nextButton.disabled = false;
        }
    } catch (error) {
        console.log(error);
    }
}
fetchMovies(currentPage);

//this is added while implementing functionality for favourite tab
function getMovieNamesFromLocalStorage(){
    const favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));
    return favouriteMovies === null ? [] : favouriteMovies;
}

function addMovieNameToLocalStorage(movieName){
    const favouriteNames = getMovieNamesFromLocalStorage();
    localStorage.setItem("favouriteMovies",JSON.stringify([...favouriteNames,movieName]))
    //we can only store data in the form of string in local storage
    //so we are using JSON.stringify()
}

function removeMovieNamefromLocalStorage(movieName){
    const favouriteNames = getMovieNamesFromLocalStorage();
    let filteredMovieNames = favouriteNames.filter((movie) => movie != movieName);
    localStorage.setItem("favouriteMovies",JSON.stringify(filteredMovieNames));
}

//2)rendering the movies

const renderMovies = (movies) => {

    //this is added while implementing favourite tab
    const favMovieNames = getMovieNamesFromLocalStorage();
    movieList.innerHTML = "";
    movies.map((movie) => {
        const { poster_path, title, vote_count, vote_average } = movie;
        let listItem = document.createElement('li');
        listItem.className = 'card';
        let imgSrc = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHNQ8nkN3ys90fo-TeeTk5BBUM6NnGi8KF1vYebGtEkEWgwwqYalBbvZqdCH9NEHFqvkc&usqp=CAU"
        listItem.innerHTML += `
        <img
             class="poster"
             src=${imgSrc}
             alt=${title}
        />
        <p class="title">${title}</p>
        <section class="vote-favouriteIcon">
            <section class="vote">
                <p class="vote-count">Votes: ${vote_count}</p>
                <p class="vote-average">Rating: ${vote_average}</p>
            </section>
            <i class="favourite-icon ${favMovieNames.includes(title) ? "fa-solid" : null} fa-regular fa-heart fa-2xl" id="${title}"></i>
        </section>
        `
        //this is added while implementing favourite tab 
        //above line ${favMovieNames.includes(title) ? "fa-solid" : null}
        //is also added while implementing favourite tab 
        const favouriteIconBtn = listItem.querySelector(".favourite-icon")
        favouriteIconBtn.addEventListener("click",(event) => {
            let {id} = event.target
            if(favouriteIconBtn.classList.contains('fa-solid')){
                favouriteIconBtn.classList.remove("fa-solid");
                removeMovieNamefromLocalStorage(id);
            }
            else{
                favouriteIconBtn.classList.add("fa-solid");
                addMovieNameToLocalStorage(id);
            }
        })
        movieList.appendChild(listItem);
    })
}

let sortByDateClicked = false;
const sortByDateButton = document.getElementById('sort-by-date');
sortByDateButton.addEventListener("click", sortByDate);
function sortByDate() {
    let sortedMovies;
    if (sortByDateClicked == false) {
        sortedMovies = movies.sort(function (a, b) {
            return new Date(a.release_date) - new Date(b.release_date)
        })
        sortByDateButton.textContent = "Sort by date (latest to oldest)"
        sortByDateClicked = true;
    }
    else if (sortByDateClicked == true) {
        sortedMovies = movies.sort(function (a, b) {
            return new Date(b.release_date) - new Date(a.release_date)
        })
        sortByDateButton.textContent = "Sort by date (oldest to latest)"
        sortByDateClicked = false;
    }
    renderMovies(sortedMovies);
}

let sortByRatingsClicked = false;
let sortByRatingsButton = document.getElementById('sort-by-rating');
sortByRatingsButton.addEventListener("click", sortByRatings);
function sortByRatings() {
    let sortedMovies;
    if (sortByRatingsClicked == false) {
        sortedMovies = movies.sort(function (a, b) {
            return a.vote_average - b.vote_average
        })
        sortByRatingsButton.textContent = 'Sort by ratings (most to least)'
        sortByRatingsClicked = true;
    }
    else if (sortByRatingsClicked == true) {
        sortedMovies = movies.sort(function (a, b) {
            return b.vote_average - a.vote_average
        })
        sortByRatingsButton.textContent = 'Sort by ratings (least to most)'
        sortByRatingsClicked = false;
    }
    renderMovies(sortedMovies);
}

//pagination
const pagination = document.querySelector("div.pagination")
const prevButton = document.querySelector("#prev-button");
const pageNumberButton = document.querySelector("#page-number-button")
const nextButton = document.querySelector("#next-button");
prevButton.addEventListener('click', () => {
    currentPage--;
    fetchMovies(currentPage);
    pageNumberButton.textContent = `Current page:${currentPage}`
})
nextButton.addEventListener('click', () => {
    currentPage++;
    fetchMovies(currentPage);
    pageNumberButton.textContent = `Current page:${currentPage}`
})

//search functionality
async function searchMovies(searchedMovie) {
    try {
        if (searchedMovie == "") {
            alert("Provide some value")
            return
        }
        let response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchedMovie}&api_key=${API_KEY}&include_adult=false&language=en-US&page=1`)
        let result = await response.json()
        movies = result.results
        renderMovies(movies);
    }
    catch (error) {
        console.log(error);
    }
}
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", () => {
    searchMovies(searchInput.value)
    pagination.style.display = "none"
})
const allTab = document.getElementById("all-tab")
const favouritesTab = document.getElementById("favourites-tab");
const sortBtns = document.querySelector(".sorting-options");
allTab.addEventListener("click",switchTab)
favouritesTab.addEventListener("click",switchTab)
const getMovieByName = async (movieName) =>{
    try{
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=${API_KEY}&Include_adult=false&language=en-US&page=1`);
        const result = await response.json();
        // console.log(result);
        return result.results[0];
    }
    catch(error){
        console.log(error);
    }
}
const showFavourites = (favMovie) =>{
    const {poster_path,title,vote_average,vote_count} = favMovie;
    let listItem = document.createElement('li');
        listItem.className = 'card';
        let imgSrc = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHNQ8nkN3ys90fo-TeeTk5BBUM6NnGi8KF1vYebGtEkEWgwwqYalBbvZqdCH9NEHFqvkc&usqp=CAU"
        listItem.innerHTML += `
        <img
             class="poster"
             src=${imgSrc}
             alt=${title}
        />
        <p class="title">${title}</p>
        <section class="vote-favouriteIcon">
            <section class="vote">
                <p class="vote-count">Votes: ${vote_count}</p>
                <p class="vote-average">Rating: ${vote_average}</p>
            </section>
            <i class="favourite-icon fa-solid fa-xmark fa-2xl xmark" id="${title}"></i>
        </section>
        `
        const removeFromWishListBtn = listItem.querySelector(".xmark");
        removeFromWishListBtn.addEventListener("click",(event) =>{
            const {id} = event.target;
            removeMovieNamefromLocalStorage(id);
            fetchWishListMovie();
        })
        movieList.appendChild(listItem);
}
const fetchWishListMovie = async () =>{
    movieList.innerHTML = "";
    const movieNamesList = getMovieNamesFromLocalStorage();
    for(let i=0;i<movieNamesList.length;i++){
        const movieName = movieNamesList[i];
        let movieDataFromName = await getMovieByName(movieName);
        showFavourites(movieDataFromName);
    }
}
function displayMovies(){
    if(allTab.classList.contains("active-tab")){
        renderMovies(movies);
        sortBtns.style = "revert"; //or sortBtns.style.display = "flex";
        pagination.style = "revert"; //or pagination.style.display = "flex";
    }
    else if(favouritesTab.classList.contains("active-tab")){
        fetchWishListMovie();
        sortBtns.style.display = "none";
        pagination.style.display = "none";
    }
}
function switchTab(event){
    allTab.classList.remove("active-tab")
    favouritesTab.classList.remove("active-tab")
    event.target.classList.add("active-tab");
    displayMovies();
}





// let favouriteTab = document.getElementById("favourites-tab");
// let allTab = document.getElementById("all-tab");
// favouriteTab.addEventListener("click",(event) => {
//     favouriteTab.classList.add('active-tab');
//     allTab.classList.remove('active-tab');
//     pagination.style.display = "none";
// })
// allTab.addEventListener("click",() =>{
//     renderMovies(movies);
//     favouriteTab.classList.remove('active-tab');
//     allTab.classList.add('active-tab');
//     pagination.style.display = "flex"
// })