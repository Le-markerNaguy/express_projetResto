/*
  Warnings:

  - A unique constraint covering the columns `[qrToken]` on the table `table_` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "table_" ADD COLUMN "qrToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "table__qrToken_key" ON "table_"("qrToken");
