import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {postsRepository} from "../../repositories/posts.repository";
import {isValidId} from "../../validation/postInputDtoValidation";
import {Post} from "../../types/post";

export function deletePostHandler(req: Request, res: Response) {
    const id = req.params.id;
    if(!id || !isValidId(id)){
        res.status(HttpStatus.NotFound).send(createErrorMessages([{field: "id", message: "Invalid id"}]));
        return;
    }
    const post: Post | null = postsRepository.findPostById(id);
    if(!post){
        res.status(HttpStatus.NotFound).send(createErrorMessages([{field: "id", message: "Post not found"}]));
        return;
    }
    postsRepository.deletePost(id);
    res.sendStatus(HttpStatus.NoContent);
}