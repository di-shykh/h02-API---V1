import {Router} from "express";
import {getBlogHandler} from "./handlers/get-blog.handler";
import {getBlogListHandler} from "./handlers/get-blog-list.handler";
import {createBlogHandler} from "./handlers/create-blog.handler";
import {updateBlogHandler} from "./handlers/update-blog.handler";
import {deleteBlogHandler} from "./handlers/delete-blog.handler";
import {idValidator} from "../../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validation.result.middleware";
import {blogInputDtoValidation} from "../validation/blog.input-dto.validation-middleware";

export const blogsRouter: Router = Router({});

blogsRouter
    .get("", getBlogListHandler)
    .get("/:id", idValidator, inputValidationResultMiddleware, getBlogHandler)
    .post("", blogInputDtoValidation, inputValidationResultMiddleware, createBlogHandler)
    .put("/:id", idValidator, blogInputDtoValidation, inputValidationResultMiddleware, updateBlogHandler)
    .delete("/:id", idValidator, inputValidationResultMiddleware, deleteBlogHandler);