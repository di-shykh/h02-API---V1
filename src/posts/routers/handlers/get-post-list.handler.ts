import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {blogsRepository} from "../../repositories/blogs.repository";

export function getPostListHandler(req: Request, res: Response) {
    const blogs = blogsRepository.findAllBlogs();
    res.status(HttpStatus.Ok).send(blogs);
}