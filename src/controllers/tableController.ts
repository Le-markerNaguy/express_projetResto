import prisma from '../lib/prisma';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

export const getAllTables = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tables = await prisma.table_.findMany();
    const frontendUrl = process.env.FRONTEND_URL;
    const tablesWithQr = await Promise.all(
      tables.map(async (table: any) => {
        if (!table.qrToken) return { ...table, qrCodeImage: null };
        const qrUrl = `${frontendUrl}/?table=${table.qrToken}`;
        const qrCodeImage = await QRCode.toDataURL(qrUrl);
        return { ...table, qrCodeImage };
      })
    );
    res.json(tablesWithQr);
  } catch (error) {
    console.error('Erreur dans getAllTables:', error);
    res.status(500).json({ error: "Erreur lors de la récupération des tables.", details: error instanceof Error ? error.message : error });
  }
};

export const createTable = async (req: Request, res: Response): Promise<void> => {
  const { numero } = req.body;
  try {
    const qrToken = uuidv4();
    const table = await prisma.table_.create({ data: { numero, qrToken } });
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      throw new Error('FRONTEND_URL non défini dans les variables d\'environnement');
    }
    const qrUrl = `${frontendUrl}/?table=${qrToken}`;
    const qrCodeImage = await QRCode.toDataURL(qrUrl);
    res.status(201).json({ ...table, qrCodeImage });
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la création de la table.", details: error instanceof Error ? error.message : error });
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