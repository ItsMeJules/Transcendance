-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('PUBLIC', 'PROTECTED', 'PRIVATE', 'DIRECT');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "profilePicture" TEXT,
    "hash" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "isTwoFactorAuthenticationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorAuthenticationSecret" TEXT,
    "isPlaying" BOOLEAN NOT NULL DEFAULT false,
    "gamesPlayed" INTEGER DEFAULT 0,
    "gamesWon" INTEGER DEFAULT 0,
    "userPoints" INTEGER DEFAULT 0,
    "userLevel" DECIMAL(65,30) DEFAULT 0,
    "currentRoom" TEXT NOT NULL DEFAULT 'general',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameMode" INTEGER NOT NULL,
    "player1Score" INTEGER NOT NULL DEFAULT 0,
    "player2Score" INTEGER NOT NULL DEFAULT 0,
    "player1Id" INTEGER NOT NULL,
    "player2Id" INTEGER NOT NULL,
    "winnerId" INTEGER,
    "loserId" INTEGER,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "type" "RoomType" NOT NULL DEFAULT 'PUBLIC',
    "name" TEXT NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "muteUntil" INTEGER[],
    "ownerId" INTEGER,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_userFriends" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_blockedUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_bannedUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_mutedUsersInRoom" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_adminUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_activeUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_userFriends_AB_unique" ON "_userFriends"("A", "B");

-- CreateIndex
CREATE INDEX "_userFriends_B_index" ON "_userFriends"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_blockedUsers_AB_unique" ON "_blockedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_blockedUsers_B_index" ON "_blockedUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_bannedUsers_AB_unique" ON "_bannedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_bannedUsers_B_index" ON "_bannedUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_mutedUsersInRoom_AB_unique" ON "_mutedUsersInRoom"("A", "B");

-- CreateIndex
CREATE INDEX "_mutedUsersInRoom_B_index" ON "_mutedUsersInRoom"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_adminUsers_AB_unique" ON "_adminUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_adminUsers_B_index" ON "_adminUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_activeUsers_AB_unique" ON "_activeUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_activeUsers_B_index" ON "_activeUsers"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_currentRoom_fkey" FOREIGN KEY ("currentRoom") REFERENCES "Room"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userFriends" ADD CONSTRAINT "_userFriends_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userFriends" ADD CONSTRAINT "_userFriends_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blockedUsers" ADD CONSTRAINT "_blockedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blockedUsers" ADD CONSTRAINT "_blockedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bannedUsers" ADD CONSTRAINT "_bannedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bannedUsers" ADD CONSTRAINT "_bannedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mutedUsersInRoom" ADD CONSTRAINT "_mutedUsersInRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mutedUsersInRoom" ADD CONSTRAINT "_mutedUsersInRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_adminUsers" ADD CONSTRAINT "_adminUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_adminUsers" ADD CONSTRAINT "_adminUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_activeUsers" ADD CONSTRAINT "_activeUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_activeUsers" ADD CONSTRAINT "_activeUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
