import {ADMIN_USERNAME, ADMIN_PASSWORD} from "../../src/auth/middlewares/super-admin.guard-middleware";

export function generateBasicAuthToken(): string {
    const credentials: string = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`;
    const token: string = Buffer.from(credentials).toString('base64');
    return `Basic ${token}`;
}