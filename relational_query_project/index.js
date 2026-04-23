import { Pool } from 'pg'
import express from 'express'

const app = express()
const port = 3000

const db = new Pool({
    user: "neondb_owner",
    host: "ep-silent-flower-aoqmmhui-pooler.c-2.ap-southeast-1.aws.neon.tech",
    database: "neondb",
    password: "npg_TLtGX3pSYQJ5",
    port: 5432,
    ssl: true
})

db.on("error", (error) => {
    console.error("PostgreSQL pool error:", error)
})

async function connect() {
    try{
        const response = await db.query("SELECT * FROM users")
        console.log("Connected to PostgreSQL database")
        console.log("Users:", response.rows)
    } catch (error) {
        console.error("Error connecting to PostgreSQL database:", error)
    }
}

connect()

app.use(express.json())

app.post("/signup", async(req, res) => {
    const client = await db.connect()
    try {
        const { username, password, email } = req.body
        const { city, country, street, picode, pincode } = req.body
        const pin = pincode ?? picode

        await client.query("BEGIN")

        const response = await client.query(
            "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id",
            [username, password, email]
        )
 
        const userId = response.rows[0].id
        await client.query(
            "INSERT INTO address (user_id, city, country, street, pincode) VALUES ($1, $2, $3, $4, $5)",
            [userId, city, country, street, pin]
        )

        await client.query("COMMIT")

        res.json({
            message: "User signed up successfully",
            user: response.rows[0]
        })
    } catch (error) {
        await client.query("ROLLBACK")
        console.error("Signup error:", error)
        res.status(500).json({ error: "Failed to sign up user" })
    } finally {
        client.release()
    }
})

app.get("/users", async (req, res) => {
  const id = req.query.id;

  const query1 = "SELECT * FROM users WHERE id = $1";
  const query2 = "SELECT * FROM address WHERE user_id = $1";

  try {
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userResponse = await db.query(query1, [id]);
    const addressResponse = await db.query(query2, [id]);

    if (userResponse.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: userResponse.rows[0],
      address: addressResponse.rows[0] || null
    });

  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})

// transaction  