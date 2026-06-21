import Groq from "groq-sdk"
import express from "express"
import cors from "cors"
const app = express()
const PORT = 5000
app.use(cors())
app.use(express.json())
const  MY_SECRET_KEY = "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"
app.get('/api/get-api-key', (req , res) => {
    res.json({apiKey : MY_SECRET_KEY})
})
app.listen(PORT , () => console.log("server is working nice"))


