import { Client } from 'pg'
import express from 'express'

const app = express()
const port = 3000

const pgclient2 = new Client({
    user: "neondb_owner",
    host: "ep-silent-flower-aoqmmhui-pooler.c-2.ap-southeast-1.aws.neon.tech",
    database: "neondb",
    password: "npg_TLtGX3pSYQJ5",
    port: 5432,
    ssl: true
})

async function connect() {
    try{
        await pgclient2.connect()
        console.log("Connected to PostgreSQL database")
        const response = await pgclient2.query("SELECT * FROM users")
        console.log("Users:", response.rows)
    } catch (error) {
        console.error("Error connecting to PostgreSQL database:", error)
    }
}

connect()

app.use(express.json())

app.post("/signup", async(req, res) => {
    try {
        const { username, password, email } = req.body
        const response = await pgclient2.query(
            "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
            [username, password, email]
        )

        res.json({
            message: "User signed up successfully",
            user: response.rows[0]
        })
    } catch (error) {
        console.error("Signup error:", error)
        res.status(500).json({ error: "Failed to sign up user" })
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})