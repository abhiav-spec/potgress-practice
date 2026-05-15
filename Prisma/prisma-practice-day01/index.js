import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dotenv from "dotenv";
dotenv.config();


//to run this file
//nodemon index.js

/*async function createuser() {
    const user = await prisma.user.create({
        data: {
            name: "John Doe",
            email: "john2@example.com",
            city: "New York",
            password: "password",
        },
    });
    console.log(user);
}

async function finduser() {
    const user = await prisma.user.findUnique({
        where: {
            email: "john@example.com"
        }
    })
    console.log(user);
}

createuser()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

finduser()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
*/

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/create-user", async (req, res) => {
    try {
        const { name, email, city, password } = req.body;
        const user = await prisma.user.create({
            data: {
                name,
                email,
                city,
                password,
            },
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create user" });
    }
});

app.post("/api/create-todo/:userId", async (req, res) => {
    try {
        const { title, description } = req.body;
        const { userId } = req.params;
        const todo = await prisma.todo.create({
            data: {
                title,
                description,
                userId: parseInt(userId),
            },
        });
        res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create todo" });
    }
});

app.get("/api/todos/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const todos = await prisma.todo.findMany({
            where: {
                userId: parseInt(userId),
            }
        });
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



