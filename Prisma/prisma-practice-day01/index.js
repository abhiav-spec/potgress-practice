import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function createuser() {
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

