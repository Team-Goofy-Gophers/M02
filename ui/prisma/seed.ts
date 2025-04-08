import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const main = async () => {
  await db.appSettings.create({
    data: {
      howItWorks: "",
    }
  })
}

main().catch(console.error)
