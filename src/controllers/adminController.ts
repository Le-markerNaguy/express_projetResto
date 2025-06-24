import { Request, Response } from 'express';
import prisma from '../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getAllAdmins = async (_req: Request, res: Response): Promise<void> => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        nom: true,
        role: true,
      },
    });
    res.json(admins);
  } catch (error) {
    console.error('Erreur dans getAllAdmins:', error);
    res.status(500).json({ error: "Erreur lors de la récupération des admins." });
  }
};

export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  const { nom,email , motDePasse } = req.body;
  try {
    const motDePasseHash = await bcrypt.hash(motDePasse, 10);
    const admin = await prisma.admin.create({
      data: { nom, email, motDePasseHash },
    });
    res.status(201).json({
      id: admin.id,
      nom: admin.nom,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error('Erreur dans createAdmin:', error);
    res.status(400).json({ error: "Erreur lors de la création de l'admin." });
  }
};

export const deleteAdmin = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.admin.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Erreur dans deleteAdmin:', error);
    res.status(404).json({ error: "Erreur lors de la suppression de l'admin." });
  }
};

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  const { nom , email , motDePasse } = req.body;
  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    console.log('loginAdmin debug:', { email, motDePasse, admin });
    if (!admin) {
      res.status(401).json({ error: 'Nom ou mot de passe invalide' });
      return;
    }
    const isValid = await bcrypt.compare(motDePasse, admin.motDePasseHash);
    if (!isValid) {
      res.status(401).json({ error: 'Nom ou mot de passe invalide' });
      return;
    }
    const token = jwt.sign(
      { id: admin.id, nom: admin.nom, role: admin.role },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '2h' }
    );
    res.json({ token, admin: { id: admin.id, nom: admin.nom, email: admin.email, role: admin.role } });
  } catch (error) {
    console.error('Erreur dans loginAdmin:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    // Nombre total de commandes
    const totalOrders = await prisma.commande.count()

    // Somme totale des ventes
    const orders = await prisma.commande.findMany({
      select: { prixtotal: true },
    })
    const totalSales = orders.reduce((sum, order) => sum + order.prixtotal, 0)

    // Nombre de plats
    const totalDishes = await prisma.plat.count()

    // Nombre de commandes par statut
    const statusCounts = await prisma.commande.groupBy({
      by: ['statut'],
      _count: {
        statut: true,
      },
    })

    const statusMap: Record<string, number> = {
      pending: 0,
      inPreparation: 0,
      served: 0,
    }

    statusCounts.forEach(item => {
      const key = item.statut
      statusMap[key] = item._count.statut
    })

    res.json({
      totalOrders,
      totalSales,
      totalDishes,
      statusCounts: statusMap,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des stats :', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

