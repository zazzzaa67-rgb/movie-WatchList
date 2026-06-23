import Groq from "groq-sdk"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { marked } from 'marked' 
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
    baseURL : process.env.GROQ_URL || ""
})

app.get("/", (req, res) => {
    res.send("Backend is working")
})

app.get("/api/chat", (req, res) => {
    res.send("API Chat Route is active")
})

app.post('/api/chat', async (req, res) => {
    console.log("POST /api/chat HIT")
    try {
        // تأكيد وجود الـ API Key قبل طلب الـ AI لمنع كراش السيرفر
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ error: "Missing GROQ_API_KEY on Vercel side." })
        }

        const prompt = req.body.prompt
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" })
        }

        const messages = [
            {
                role: "system",
                content: `You are a movie recommendation assistant. Recommend only movies that closely match the user's request. Format the response using clear headings and bullet points. Use a separate section for each movie.`
            },
            {
                role: "user",
                content: prompt
            }
        ]

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.7 // تقليل الـ temperature لـ 0.7 لضمان استقرار الإجابة
        })

        let aiReply = response.choices[0]?.message?.content || ""
        aiReply = aiReply.trim()
        
        // تحويل الماركداون إلى HTML بأمان
        const html = marked.parse(aiReply)
        
        res.json({ reply: html })
    } catch (err) {
        console.error("Server Error:", err)
        res.status(500).json({
            error: err.message || "Something went wrong inside the serverless function"
        })
    }
})

export default app;