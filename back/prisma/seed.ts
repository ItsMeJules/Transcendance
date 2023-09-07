import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    // Seed users
    const alice = await prisma.user.upsert({
      where: { email: 'alice@prisma.io' },
      update: {},
      create: {
        email: 'alice@prisma.io',
        username: 'alice123',
        firstName: 'Alice',
        lastName: 'Smith',
        hash: 'hashed_password_here',
        // Add other user data here
      },
    });

    const bob = await prisma.user.upsert({
      where: { email: 'bob@prisma.io' },
      update: {},
      create: {
        email: 'bob@prisma.io',
        username: 'bob456',
        firstName: 'Bob',
        lastName: 'Johnson',
        hash: 'hashed_password_here',
        // Add other user data here
      },
    });

    // Seed games
    const game1 = await prisma.game.create({
      data: {
        gameMode: 1,
        player1Score: 10,
        player2Score: 15,
        player1Id: alice.id,
        player2Id: bob.id,
      },
    });

    const game2 = await prisma.game.create({
      data: {
        gameMode: 2,
        player1Score: 20,
        player2Score: 5,
        player1Id: bob.id,
        player2Id: alice.id,
      },
    });
    
    // Seed rooms
    const room1 = await prisma.room.create({
      data: {
        type: 'PUBLIC',
        name: 'public humiliation',
        // Add other room data here
      },
    });
    
    // Update the user's current room
    await prisma.user.update({
      where: { id: alice.id },
      data: {
        currentRoom: 'public humiliation', // Make sure this matches the room name
      },
    });
    
    await prisma.user.update({
      where: { id: bob.id },
      data: {
        currentRoom: 'public humiliation', // Make sure this matches the room name
      },
    });
    
    // // Seed messages
    // const message1 = await prisma.message.create({
    //   data: {
    //     text: 'Hello, Alice!',
    //     roomId: 1, // Adjust room ID as needed
    //     authorId: alice.id,
    //   },
    // });

    // const message2 = await prisma.message.create({
    //   data: {
    //     text: 'Hi there, Bob!',
    //     roomId: 1, // Adjust room ID as needed
    //     authorId: bob.id,
    //   },
    // });

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
