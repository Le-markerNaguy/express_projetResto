import prisma from '../../lib/prisma';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

export const getAllTables = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tables = await prisma.table_.findMany();
    // Pour chaque table, générer dynamiquement l'image QR code (base64)
    const tablesWithQr = await Promise.all(
      tables.map(async (table: any) => {
        if (!table.qrToken) return { ...table, qrCodeImage: null };
        const qrUrl = `https://tonsite.com/?table=${table.qrToken}`;
        const qrCodeImage = await QRCode.toDataURL(qrUrl);
        return { ...table, qrCodeImage };
      })
    );
    res.json(tablesWithQr);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des tables." });
  }
};

export const createTable = async (req: Request, res: Response): Promise<void> => {
  const { numero } = req.body;
  try {
    // Générer un token unique pour la table
    const qrToken = uuidv4();
    // Créer la table avec le token
    const table = await prisma.table_.create({ data: { numero, qrToken } });
    // Générer l'URL à encoder dans le QR code
    const qrUrl = `https://tonsite.com/?table=${qrToken}`;
    // Générer le QR code (base64)
    const qrCodeImage = await QRCode.toDataURL(qrUrl);
    // Retourner la table et l'image du QR code
    res.status(201).json({ ...table, qrCodeImage });
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la création de la table." });
  }
};

export const deleteTable = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  console.log('Suppression table, id reçu :', id);
  try {
    await prisma.table_.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ error: "Table non trouvée ou déjà supprimée." });
  }
};