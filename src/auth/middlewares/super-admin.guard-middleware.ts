import {NextFunction, Request, Response} from "express";
import {HttpStatus} from "../../core/types/http-statuses";

export const ADMIN_USERNAME: string = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD: string = process.env.ADMIN_PASSWORD || "qwerty";

export const superAdminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction): void => {
    try{
        const authHeader = req.headers["authorization"] as string;
        if (!authHeader) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
        }

        const [authType,authToken] = authHeader.split(" ");
        if (authType !== "Basic") {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
        }
        if (!authToken) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
        }
        const credentials: string = Buffer.from(authToken, "base64").toString("utf-8");
        const [username, password] = credentials.split(":");
        if (username!== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
        }
    }
    catch(err){
        res.sendStatus(HttpStatus.Unauthorized);
        return;
    }

    next();
}