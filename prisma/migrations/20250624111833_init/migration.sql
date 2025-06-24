-- CreateTable
CREATE TABLE "table_" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "qrToken" TEXT,

    CONSTRAINT "table__pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plat" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "prix" DOUBLE PRECISION NOT NULL,
    "categorie" TEXT NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT,

    CONSTRAINT "plat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT,
    "motDePasseHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateModification" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateSuppression" TIMESTAMP(3),

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commande" (
    "id" SERIAL NOT NULL,
    "tableId" INTEGER NOT NULL,
    "prixtotal" DOUBLE PRECISION NOT NULL,
    "statut" TEXT NOT NULL,
    "dateCommande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandePlat" (
    "commandeId" INTEGER NOT NULL,
    "platId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "commandePlat_pkey" PRIMARY KEY ("commandeId","platId")
);

-- CreateIndex
CREATE UNIQUE INDEX "table__numero_key" ON "table_"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "table__qrToken_key" ON "table_"("qrToken");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- AddForeignKey
ALTER TABLE "commande" ADD CONSTRAINT "commande_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "table_"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandePlat" ADD CONSTRAINT "commandePlat_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandePlat" ADD CONSTRAINT "commandePlat_platId_fkey" FOREIGN KEY ("platId") REFERENCES "plat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
