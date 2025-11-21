import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {db} from "../../../db/in-memory.db";
import {Blog} from "../../../blogs/types/blog";
import {Post} from "../../types/post";
import {PostInputDto} from "../../dto/post.input-dto";
import {postInputDtoValidation} from "../../validation/postInputDtoValidation";
import {blogsRepository} from "../../../blogs/repositories/blogs.repository";
import {postsRepository} from "../../repositories/posts.repository";

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

    const blog: Blog | null = blogsRepository.findBlogById(req.body.blogId);
    if (!blog) {
        res.status(HttpStatus.BadRequest).send({
            errorsMessages: [{
                message: "Blog not found",
                field: "blogId"
            }]
        });
        return;
    }

    const newPost: Post = {
       id: newId,
       title: req.body.title,
       shortDescription: req.body.shortDescription,
       content: req.body.content,
       blogId: req.body.blogId,
       blogName: blog.name,
   };
    postsRepository.createPost(newPost);
    res.status(HttpStatus.Created).send(newPost)
}

