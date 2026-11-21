import type { Request, Response, NextFunction } from 'express';

export const authMiddleware = (...requiredRole: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.session.user) 
            return res.status(401).json({ message: "Unauthenticated" });

        if ( requiredRole.length > 0 && !requiredRole.includes(req.session.user.role)) 
            return res.status(403).json({ message: "Forbidden: insufficient permissions" });
        
        return next();
    };
};