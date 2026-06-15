const movie = document.getElementById("movieName")
const searchList = document.getElementById("newMovies")
const watchList = document.getElementById("watchList")
const searchBtn = document.getElementById("search")
let  watchListArr = []
let   searchListArr=[]
let moviePosts = []
let html = ''
if(searchList){
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
        }
    } )
}
function addToWatchlist(id){
    const selectedMovie = searchListArr.find(movie => movie.imdbID == id)
    if(selectedMovie){
    watchListArr.push(
        selectedMovie
    )   
    }
    if(watchList){
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
                            <button class="add" data-id="${watch.imdbID}"><i class="fa-solid fa-circle-plus"></i> Watchlist</button>
                        </div>
                        <p class="plot">${watch.Plot}</p>
                    </div>
                </div>
                
            `
        }
    }

}

