import {Request, Response} from "express";
import {BlogInputDto} from "../../dto/blog.input-dto";
import {HttpStatus} from "../../../core/types/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {db} from "../../../db/in-memory.db";
import {blogInputDtoValidation} from "../../validation/blogInputDtoValidation";
import {Blog} from "../../types/blog";
import {blogsRepository} from "../../repositories/blogs.repository";

export function createBlogHandler(req: Request<{},{},BlogInputDto>, res: Response) {
   const errors = blogInputDtoValidation(req.body);
   if (errors.length > 0) {
       res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
       return;
   }

    const lastBlogId = db.blogs[db.blogs.length - 1]?.id;
    const newId = lastBlogId
        ? (parseInt(lastBlogId) + 1).toString()
        : "1";
   const newBlog: Blog = {
       id: newId,
       name: req.body.name,
       description: req.body.description,
       websiteUrl: req.body.websiteUrl,
   };
   blogsRepository.createBlog(newBlog);
   res.status(HttpStatus.Created).send(newBlog);
}
