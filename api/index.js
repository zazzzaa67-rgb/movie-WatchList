import Groq from "groq-sdk"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import {marked} from 'marked'
dotenv.config()

const app = express()
const PORT = 5000
app.use(cors())
app.use(express.json())
const groq = new Groq({
    apiKey : process.env.GROQ_API_KEY
    // baseURL : process.env.GROQ_URL,
})
app.get("/", (req,res)=>{
    res.send("Backend is working")
})
app.post('/api/chat', async (req , res) => {
    console.log("POST /api/chat HIT")
    try{
    const messages = [
        {
            role: "system",
            content : `You are a movie recommendation assistant.
    
    Your job is to recommend movies based on the user's preferences. The user may describe the genre, runtime, mood, release year, actors, themes, or any other preferences.
    
    Rules:
    
    1. Recommend only movies that closely match the user's request.
    2. Be specific and avoid generic recommendations.
    3. Organize the response clearly.
    4. Use a separate section for each movie.
    5. For each movie include:
    
       * Movie title
       * Release year
       * Genre
       * Runtime
       * Short spoiler-free description
       * Reason why it matches the user's request
    6. Recommend 3-5 movies unless the user requests a different number.
    7. If the user's request is unclear, ask follow-up questions before recommending movies.
    8. Prioritize accuracy and relevance over the number of recommendations.
    9. Format the response using clear headings and bullet points.
    10. Do not invent movies.
    
    Example format:
    
    # Movie Title
    
    * Year: XXXX
    * Genre: Action, Thriller
    * Runtime: 120 min
    * Why it matches: Fast-paced action with a strong mystery element.
    * Summary: Short spoiler-free description.
    * I want you also to search about movie and give the user some links for it 
    Repeat this structure for every recommendation.
    I want you to make it recognized text and please make it seperated I want every movie in seperated passage with a head .
    `
        
        }
    ]
    const prompt = req.body.prompt
    messages.push(
        {
            role:"user",
            content : prompt
        }
    ) 
    const response = await groq.chat.completions.create({
        model : "llama-3.3-70b-versatile",
        messages,
        temperature : 1 
    })
    let aiReply = response.choices[0].message.content
    aiReply = aiReply.trim()
    const html = marked.parse(aiReply)
    console.log(html)
    res.json({reply : html})
}catch(err){
    console.error(err)
    res.status(500).json({
            error: err.message
        })
}
})

module.exports = app
