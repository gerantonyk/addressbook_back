/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Contacts" (
    "ownerId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT,
    "email" TEXT,
    "address" TEXT,
    "phone" INTEGER,
    "birthday" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contacts" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
