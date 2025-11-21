import {Request, Response} from "express";
import {BlogInputDto} from "../../dto/blog.input-dto";
import {HttpStatus} from "../../../core/types/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {db} from "../../../db/in-memory.db";
import {blogInputDtoValidation} from "../../validation/blogInputDtoValidation";
import {Blog} from "../../types/blog";
import {blogsRepository} from "../../repositories/blogs.repository";
import {PostInputDto} from "../../dto/post.input-dto";
import {postInputDtoValidation} from "../../validation/postInputDtoValidation";

export function createPostHandler(req: Request<{},{},PostInputDto>, res: Response) {
   const errors = postInputDtoValidation(req.body);
   if (errors.length > 0) {
       res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
       return;
   }

    const lastPostId = db.posts[db.posts.length - 1]?.id;
    const newId = lastPostId
        ? (parseInt(lastPostId) + 1).toString()
        : "1";
   const newPost: Post = {
       id: newId,
       title: req.body.title,
       shortDescription: req.body.shortDescription,
       content: req.body.content,
       blogId: req.body.blogId,
       blogName: req.body.blogName,
   };
   blogsRepository.createBlog(newBlog);
   res.status(HttpStatus.Created).send(newBlog);
}
// export type Post = {
//     id: string;
//     title: string;
//     shortDescription: string;
//     content: string;
//     blogId: string;
//     blogName: string;
// }
