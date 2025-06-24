-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_commande" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tableId" INTEGER NOT NULL,
    "prixtotal" REAL NOT NULL,
    "statut" TEXT NOT NULL,
    "dateCommande" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "commande_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "table_" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_commande" ("dateCommande", "id", "prixtotal", "statut", "tableId") SELECT "dateCommande", "id", "prixtotal", "statut", "tableId" FROM "commande";
DROP TABLE "commande";
ALTER TABLE "new_commande" RENAME TO "commande";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
