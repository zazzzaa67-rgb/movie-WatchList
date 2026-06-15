const movie = document.getElementById("movieName")
const searchList = document.getElementById("newMovies")
const watchList = document.getElementById("watchList")
const searchBtn = document.getElementById("search")
let  watchListArr = JSON.parse(localStorage.getItem("watchList")) || []
let   searchListArr= JSON.parse(localStorage.getItem("searchList"))|| []
let moviePosts = []
let html = ''
if(searchList){
    localStorage.setItem("movieName" , movie.value)
    searchBtn.addEventListener("click" , async function(){
        await storeData() 
    })
    async function storeData(){
        searchListArr = []
        const res = await fetch(`http://www.omdbapi.com/?apikey=91dac549&s=${movie.value}`)
        const data = await res.json()
        if(data.Search){
            for(let film of data.Search ){
                const res = await fetch(`http://www.omdbapi.com/?apikey=91dac549&i=${film.imdbID}`)
                const data = await res.json()
                    searchListArr.push(data)
            }
            console.log(searchListArr)
            localStorage.setItem("searchList" , JSON.stringify(searchListArr))
            render()
        }else{
            searchList.innerHTML = `
            <div class="container">
                <p>Sorry, we couldn't find that movie. Try searching for another title.</p>
            </div>`
        }

        }
    
    function render(){
        html = ''
        for(let movie of searchListArr){
            html +=`
            <div class="movie">
                <img src=${movie.Poster} alt="movie poster" class="poster">
                <div class="movie-info">
                    <div class="movieCon">
                        <h2>${movie.Title}</h2>
                        <p class="rate"><i class="fa-solid fa-star"></i> ${movie.imdbRating}</P>
                    </div>
                    <div class="movieCon">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <button class="add" data-id="${movie.imdbID}"><i class="fa-solid fa-circle-plus"></i> Watchlist</button>
                    </div>
                    <p class="plot">${movie.Plot}</p>
                </div>
                
            </div>
            `
        }
        searchList.innerHTML = html
    }
    searchList.addEventListener("click" ,e=>{
        const targetButton = e.target.closest(".add")
        if(targetButton){
            const movieId = targetButton.dataset.id
            addToWatchlist(movieId)
            targetButton.disabled = true;
            
        }
    } )
    if(searchListArr.length > 0){
        render()
    }
}
    watchList.addEventListener("click" , e=>{
        const removeBtn = e.target.closest(".remove")
        if(removeBtn){
            const movieId = removeBtn.dataset.id
            removeFromWatchlist(movieId)

        }}
    )

function addToWatchlist(id){
    const selectedMovie = searchListArr.find(movie => movie.imdbID == id)
    if(selectedMovie){
    watchListArr.push(
        selectedMovie
    )   
    localStorage.setItem("watchList" , JSON.stringify(watchListArr))
    }
    if(watchList){
        displayWatchList()
    }

}
function displayWatchList(){ 
    if(watchListArr.length > 0){
        watchList.innerHTML=""
        for(let watch of watchListArr ){
            watchList.innerHTML +=`
                <div class="movie">
                    <img src=${watch.Poster} alt="movie poster" class="poster">
                    <div class="movie-info">
                        <div class="movieCon">
                            <h2>${watch.Title}</h2>
                            <p class="rate"><i class="fa-solid fa-star"></i> ${watch.imdbRating}</P>
                        </div>
                        <div class="movieCon">
                            <p>${watch.Runtime}</p>
                            <p>${watch.Genre}</p>
                            <button class="remove" data-id="${watch.imdbID}"><i class="fa-solid fa-circle-minus"></i> Remove</button>
                        </div>
                        <p class="plot">${watch.Plot}</p>
                    </div>
                </div>
            `}
        }
    }

if(watchList){
    displayWatchList()
}
function removeFromWatchlist(id){
    watchListArr = watchListArr.filter(movie=> movie.imdbID !== id)
    localStorage.setItem("watchList" , JSON.stringify(watchListArr))
    displayWatchList()
}