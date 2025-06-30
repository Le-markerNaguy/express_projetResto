import prisma from "../lib/prisma";
import { Request, Response } from "express";

// Renvoie le revenu par jour pour la semaine courante (lundi à dimanche)
export const getDailyRevenue = async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const day = now.getDay(); // 0 (dimanche) à 6 (samedi)
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() + diffToMonday);

    // Crée un tableau pour chaque jour de la semaine
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      d.setHours(0, 0, 0, 0);
      return d;
    });

    // Statuts considérés comme "payé" ou "livrée"
    const validStatus = ["livrée", "payée"];

    // Pour chaque jour, calcule le revenu
    const dailyRevenue = await Promise.all(
      days.map(async (date, i) => {
        const start = new Date(date);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        const revenue = await prisma.commande.aggregate({
          _sum: { prixtotal: true },
          where: {
            dateCommande: {
              gte: start,
              lte: end,
            },
            statut: { in: validStatus },
          },
        });
        return {
          day: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][i],
          revenue: revenue._sum?.prixtotal || 0,
        };
      })
    );

    res.json(dailyRevenue);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du calcul du revenu journalier." });
  }
};
