-- CreateTable
CREATE TABLE "table_" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "plat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "prix" REAL NOT NULL,
    "categorie" TEXT NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "motDePasseHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin'
);

-- CreateTable
CREATE TABLE "commande" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tableId" INTEGER NOT NULL,
    "prixtotal" REAL NOT NULL,
    "statut" TEXT NOT NULL,
    "dateCommande" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "commande_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "table_" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "commandePlat" (
    "commandeId" INTEGER NOT NULL,
    "platId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY ("commandeId", "platId"),
    CONSTRAINT "commandePlat_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "commande" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "commandePlat_platId_fkey" FOREIGN KEY ("platId") REFERENCES "plat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "table__numero_key" ON "table_"("numero");
