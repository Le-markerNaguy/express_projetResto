import prisma from "../lib/prisma";
import { Request, Response } from "express";

// src/controllers/OrderController.ts
export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.commande.findMany({
      include: {
        plats: {
          include: {
            plat: true,
          },
        },
        table: true,
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des commandes." });
  }
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const { tableId, plats } = req.body;
  console.log('createOrder - Données reçues:', { tableId, plats });
  
  try {
    // Vérifier si la table existe
    const table = await prisma.table_.findUnique({
      where: { id: tableId }
    });

    if (!table) {
      res.status(404).json({ error: "Table non trouvée." });
      return;
    }

    let total = 0;
    console.log('Calcul du total pour les plats:', plats);
    
    // Vérifier si tous les plats existent
    for (const p of plats) {
      console.log('Recherche du plat:', p);
      const plat = await prisma.plat.findUnique({ where: { id: p.id } });
      console.log('Plat trouvé:', plat);
      if (!plat) {
        res.status(404).json({ error: `Plat avec l'ID ${p.id} non trouvé.` });
        return;
      }
      total += plat.prix * p.quantite;
    }

    console.log('Création de la commande avec:', {
      tableId,
      prixtotal: total,
      plats: plats.map((p: any) => ({
        platId: p.id,
        quantite: p.quantite,
      }))
    });

    const newOrder = await prisma.commande.create({
      data: {
        tableId,
        prixtotal: total,
        statut: "en attente",
        plats: {
          create: plats.map((p: any) => ({
            platId: p.id,
            quantite: p.quantite,
          })),
        },
      },
      include: {
        table: true,
        plats: {
          include: {
            plat: true
          }
        }
      }
    });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    res.status(400).json({ error: "Erreur lors de la création de la commande." });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const { statut } = req.body;
  try {
    const updated = await prisma.commande.update({
      where: { id },
      data: { statut },
    });
    res.json(updated);
  } catch (error) {
    res.status(404).json({ error: "Commande non trouvée." });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    await prisma.commande.delete({ where: { id } });
    res.json({ message: "Commande supprimée." });
  } catch (error) {
    res.status(404).json({ error: "Erreur lors de la suppression de la commande." });
  }
};

// Calcul du revenu de la semaine courante (lundi à dimanche)
export const getWeeklyRevenue = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Début de la semaine (lundi 00:00)
    const now = new Date();
    const day = now.getDay(); // 0 (dimanche) à 6 (samedi)
    const diffToMonday = (day === 0 ? -6 : 1) - day; // Décale au lundi
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() + diffToMonday);

    // Fin de la semaine (dimanche 23:59:59)
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    // Statuts considérés comme "payé" ou "livrée"
    const validStatus = ["livrée", "payée"];

    // Filtre les commandes de la semaine courante et statut valide
    const revenue = await prisma.commande.aggregate({
      _sum: { prixtotal: true },
      where: {
        dateCommande: {
          gte: monday,
          lte: sunday,
        },
        statut: { in: validStatus },
      },
    });

    res.json({ revenue: revenue._sum?.prixtotal || 0 });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du calcul du revenu de la semaine." });
  }
};

