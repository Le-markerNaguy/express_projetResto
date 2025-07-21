import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function createTables() {
  try {
    console.log('Création des tables de test...')
    
    // Supprimer toutes les tables existantes
    await prisma.table_.deleteMany()
    console.log('Tables existantes supprimées')
    
    // Créer de nouvelles tables
    const tables = [
      { numero: 1 },
      { numero: 2 },
      { numero: 3 },
      { numero: 4 },
      { numero: 5 },
      { numero: 6 },
      { numero: 7 },
      { numero: 8 },
    ]
    
    for (const table of tables) {
      const createdTable = await prisma.table_.create({
        data: {
          numero: table.numero,
          qrToken: `table-${table.numero}-${Date.now()}`
        }
      })
      console.log(`Table ${createdTable.numero} créée avec l'ID: ${createdTable.id}`)
    }
    
    console.log('✅ Toutes les tables ont été créées avec succès!')
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTables() 