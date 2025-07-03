/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `commande` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "commande" ADD COLUMN     "token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "commande_token_key" ON "commande"("token");
