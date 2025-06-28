import express from 'express';
import {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  getWeeklyRevenue, // Assurez-vous que cette fonction est définie dans votre contrôleur
} from "../controllers/commandeController";
import  authenticateAdmin  from '../middleware/authMiddleware';

const router = express.Router();

// Commandes
router.get("/",authenticateAdmin , getAllOrders); // Récupérer toutes les commandes
router.post("/", createOrder); // Créer une nouvelle commande  
router.put("/:id",authenticateAdmin, updateOrderStatus); // Mettre à jour le statut d'une commande
router.get("/revenue-week",authenticateAdmin,getWeeklyRevenue)
export default router;