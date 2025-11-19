import express, { Express } from 'express';
import { blogsRouter } from './blogs/routers/blogs.router';
import { postsRouter } from './posts/routers/posts.router';
import { testingRouter } from './testing/routers/testing.router';
import { POSTS_PATH, BLOGS_PATH, TESTING_PATH } from "./src/core/paths/paths";
import {HttpStatus} from "./src/core/types/http-statuses";

export const setupApp = (app: Express) => {
    app.use(express.json());

    app.get('/', (req, res) => {
        res.status(HttpStatus.Ok).send('hello world!');
    });

    app.use(BLOGS_PATH, blogsRouter);
    app.use(POSTS_PATH, postsRouter);
    app.use(TESTING_PATH,testingRouter);

    return app;
}