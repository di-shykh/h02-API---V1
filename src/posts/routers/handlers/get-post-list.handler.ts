import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {postsRepository} from "../../repositories/posts.repository";
import {Post} from "../../types/post";

export function getPostListHandler(req: Request, res: Response) {
    const posts: Post[] = postsRepository.findAllPosts();
    res.status(HttpStatus.Ok).send(posts);
}