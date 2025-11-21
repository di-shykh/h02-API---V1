import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {createErrorMessages} from "../../../core/utils/error.utils";
import {blogsRepository} from "../../repositories/blogs.repository";
import {isValidId} from "../../../posts/validation/postInputDtoValidation";

export function getPostHandler(req: Request, res: Response) {
    const id = req.params.id;
    if(!id || !isValidId(id)){
        res.status(HttpStatus.NotFound).send(createErrorMessages([{field: "id", message: "Invalid id"}]));
        return;
    }
    const blog = blogsRepository.findBlogById(id);
    if(!blog){
        res.status(HttpStatus.NotFound).send(createErrorMessages([{field: "id", message: "Blog not found"}]));
        return;
    }
    res.status(HttpStatus.Ok).send(blog);
}
