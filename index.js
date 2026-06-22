

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
        searchList.innerHTML= `
        <div class="container">
            <p>Loading...</p>
        </div>`
        searchListArr = []
        const res = await fetch(`https://www.omdbapi.com/?apikey=91dac549&s=${movie.value}`)
        const data = await res.json()
        console.log(data)
        if(data.Search){
            for(let film of data.Search ){
                const res = await fetch(`https://www.omdbapi.com/?apikey=91dac549&i=${film.imdbID}`)
                const data = await res.json()
                    searchListArr.push(data)
                    
            }
            console.log(searchListArr)
            localStorage.setItem("searchList" , JSON.stringify(searchListArr))
            render()
        }else if(movie.value == ""){
            searchList.innerHTML = `
                <div class="container">
                    <p>Oops! Please type a movie title first.</p>
                </div>`

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
                <img src=${movie.Poster} alt="movie Poster" class="poster"  onerror="this.src='https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1156&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D'">
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
if(watchList){
    watchList.addEventListener("click" , e=>{
        const removeBtn = e.target.closest(".remove")
        if(removeBtn){
            const movieId = removeBtn.dataset.id
            removeFromWatchlist(movieId)}}
        )
}

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
    watchList.innerHTML=`
    <div class="container">
        <p class="empty">Your watchlist is looking a little empty...</p>
        <a href="index.html" class="move">
            <i class="fa-solid fa-circle-plus"></i>
            <p>Let’s add some movies!</p>
        </a>
    </div>`
    if(watchListArr.length > 0){
        watchList.innerHTML=""
        
        for(let watch of watchListArr ){
            watchList.innerHTML +=`
                <div class="movie">
                    <img src="${watch.Poster}" alt="movie poster" class="poster">
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
// *********** AI-SECTION *********
const messages = document.getElementById("messages")
const sendBtn = document.getElementById("send")
const aiInput = document.getElementById("AIinputs")
const openAi = document.getElementById("OpenId")
const AI = document.getElementById("AI")
openAi.addEventListener("click" , ()=>{
    if(AI.style.display == "none"){
        AI.style.display = "flex"
    }else{
        AI.style.display = "none"
    }

})

if (sendBtn) {
    sendBtn.addEventListener("click", async function() {
        console.log("BUTTON CLICKED")

        const userInputValue = aiInput.value.trim()
        if (!userInputValue) return;

        // إظهار كلمة Loading شيك
        messages.innerHTML = `
            <div class="ai-buble" style="text-align: center; color: #06b6d4;">
                <i class="fa-solid fa-spinner fa-spin"></i> Thinking...
            </div>`;

        try {
            const res = await fetch("https://movie-watch-list-teal.vercel.app/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userInputValue })
            })

            const data = await res.json()
            
            // 👑 هنا السحر: دالة سريعة بتحول الرموز لـ HTML حقيقي من غير marked
            if (data.reply) {
                let text = data.reply;

                // 1. تحويل العناوين الكبيرة ### أو ## أو # إلى <h2> لأسماء الأفلام
                text = text.replace(/#{1,3}\s+(.+)/g, '<h2>$1</h2>');

                // 2. تحويل الروابط المكتوبة كدا [IMDB](url) إلى أزرار حقيقية <a>
                text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

                // 3. تحويل النقط (*) إلى سطور عادية مع تلوين الكلام الـ Bold
                text = text.replace(/\*\s+(.+)/g, '<p>✦ $1</p>');
                text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                // 4. عرض النتيجة النظيفة جوه الشات
                messages.innerHTML = text;
            } else {
                messages.innerHTML = `<p style="color: #ef4444;">No reply received</p>`;
            }

            aiInput.value = ""

        } catch (err) {
            console.error("Fetch Error:", err)
            messages.innerHTML = `<p style="color: #ef4444;">مستحيل الاتصال بالسيرفر، تأكد أنك مشغل server.js</p>`
        }
    })
}

