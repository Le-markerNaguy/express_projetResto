import prisma from "../lib/prisma";
import { Request, Response } from "express";


export const getAllDishes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dishes = await prisma.plat.findMany();
    res.json(dishes);
  } catch (error) {
    console.error("Erreur dans getAllDishes:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des plats.", details: error instanceof Error ? error.message : error });
  }
};

export const createDish = async (req: Request, res: Response): Promise<void> => {
  const { nom, description, prix, categorie, disponible, image } = req.body;
  try {
    const newDish = await prisma.plat.create({
      data: {
        nom,
        description,
        prix: typeof prix === "number" ? prix : parseFloat(prix),
        categorie,
        disponible,
        image,
      },
    });
    res.status(201).json(newDish);
  } catch (error) {
    console.error("Erreur dans createDish:", error);
    res.status(400).json({ error: "Impossible de créer le plat.", details: error instanceof Error ? error.message : error });
  }
};

export const updateDish = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const { nom, description, prix, categorie, disponible, image } = req.body;

  console.log("PATCH updateDish debug:", req.body);

  try {
    // On construit dynamiquement les champs à mettre à jour
    const updateData: any = {};
    if (nom !== undefined) updateData.nom = nom;
    if (description !== undefined) updateData.description = description;
    if (prix !== undefined) updateData.prix = typeof prix === "number" ? prix : parseFloat(prix);
    if (categorie !== undefined) updateData.categorie = categorie;
    if (disponible !== undefined) updateData.disponible = disponible;
    if (image !== undefined) updateData.image = image;

    const updated = await prisma.plat.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
    console.log("Plat mis à jour :", updated);
  } catch (error) {
    console.error("Erreur dans updateDish (PATCH):", error);
    res.status(404).json({ error: "Plat non trouvé ou erreur serveur.", details: error instanceof Error ? error.message : error });
  }
};

export const deleteDish = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    await prisma.plat.delete({ where: { id } });
    res.json({ message: "Plat supprimé." });
  } catch (error: any) {
    console.error("Erreur dans deleteDish:", error);
    if (error.code === 'P2003' || (error.message && error.message.includes('Foreign key constraint'))) {
      res.status(400).json({ error: "Impossible de supprimer ce plat car il est lié à une ou plusieurs commandes." });
    } else {
      res.status(404).json({ error: "Erreur lors de la suppression.", details: error instanceof Error ? error.message : error });
    }
  }
};