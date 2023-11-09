-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('discord', 'google', 'credentials');

-- CreateEnum
CREATE TYPE "Message_type" AS ENUM ('standalone_message', 'shared_message', 'answered_message');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "provider" "Provider" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "id_creator" INTEGER NOT NULL,
    "avatar_url" INTEGER[],

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_conversation" INTEGER NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "id_sender" INTEGER NOT NULL,
    "id_conversation" INTEGER NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "type" "Message_type" NOT NULL DEFAULT 'standalone_message',
    "reference_message_id" INTEGER NOT NULL,
    "attachment_list" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReadHistory" (
    "id" SERIAL NOT NULL,
    "id_message" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "MessageReadHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_id_creator_fkey" FOREIGN KEY ("id_creator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_id_conversation_fkey" FOREIGN KEY ("id_conversation") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_id_conversation_fkey" FOREIGN KEY ("id_conversation") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_id_sender_fkey" FOREIGN KEY ("id_sender") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

