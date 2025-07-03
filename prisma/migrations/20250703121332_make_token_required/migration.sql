/*
  Warnings:

  - Made the column `token` on table `commande` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "commande" ALTER COLUMN "token" SET NOT NULL;
