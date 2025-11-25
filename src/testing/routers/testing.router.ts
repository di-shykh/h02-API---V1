import {Router, Request, Response} from 'express';
import {db} from '../../db/in-memory.db';
import {HttpStatus} from "../../core/types/http-statuses";

export const testingRouter: Router = Router({});

testingRouter.delete('/all-data', (req: Request, res: Response): void => {
    console.log('✅ Testing endpoint called'); // для диагностики
    db.blogs = [];
    db.posts = [];
    res.sendStatus(HttpStatus.NoContent);
})