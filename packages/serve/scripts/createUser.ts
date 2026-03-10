import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

prismaClient.$transaction(async (client) => {
  await client.user.upsert({
    where: {
      id: 6,
    },
    create: {
      name: "Users" + Date.now(),
      email: Date.now() + "@gmail.com",
      password: "password",
      invitedBy: 2,
    },
    update: {
      name: "Users" + Date.now(),
      email: Date.now() + "@gmail.com",
      password: "password",
      invitedBy: 2,
    },
  });

  const userOne = await client.user.findUniqueOrThrow({
    where: {
      id: 1,
    },
    include: {
      invitee: true,
    },
  });

  console.log(userOne);
});
