import prisma from '../src/lib/prisma';
import { randomUUID } from 'crypto';

async function main() {
  const commandes = await prisma.commande.findMany({
    where: { token: null }
  });

  for (const commande of commandes) {
    await prisma.commande.update({
      where: { id: commande.id },
      data: { token: randomUUID() }
    });
    console.log(`Token ajouté à la commande ${commande.id}`);
  }
}

main()
  .then(() => {
    console.log('Tous les tokens ont été ajoutés.');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 