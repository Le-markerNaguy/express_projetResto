import { Request, Response, NextFunction } from "express";

// Middleware d'authentification pour vérifier si l'utilisateur est un admin authentifié
export default function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  // Exemple simple : vérifie la présence d'un token d'admin dans l'en-tête Authorization
  // Remplacez cette logique par votre vraie vérification JWT ou session
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Ici, vous pouvez décoder le token et vérifier le rôle admin
    // Pour l'exemple, on laisse passer
    return next();
  }
  res.status(401).json({ error: "Accès administrateur requis." });
}
