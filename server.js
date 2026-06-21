import Groq from "groq-sdk"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
const app = express()
const PORT = 5000
app.use(cors())
app.use(express.json())
const groq = new Groq({
    apiKey : process.env.GROQ_API_KEY,
    baseURL=process.env.GROQ_URL,
})
const messages = []
app.get('/api/get-api-key', (req , res) => {
    const {prompt} = req.body
    const response = await groq.chat.completions.create({
        model : "llama3-8b-8192",
        messages,
        stream: true,
        
    })
})
app.listen(PORT , () => console.log("server is working nice"))


