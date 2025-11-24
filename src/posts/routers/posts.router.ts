import {Router} from "express";
import {getPostHandler} from "./handlers/get-post.handler";
import {getPostListHandler} from "./handlers/get-post-list.handler";
import {createPostHandler} from "./handlers/create-post.handler";
import {updatePostHandler} from "./handlers/update-post.handler";
import {deletePostHandler} from "./handlers/delete-post.handler";
import {idValidator} from "../../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validation.result.middleware";
import {postInputDtoValidation} from "../validation/post.input-dto.validation-middlewares";
import {superAdminMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";

export const postsRouter: Router = Router({});

postsRouter
    .get("", getPostListHandler)
    .get("/:id",  idValidator, inputValidationResultMiddleware, getPostHandler)
    .post("", superAdminMiddleware, postInputDtoValidation, inputValidationResultMiddleware, createPostHandler)
    .put("/:id", superAdminMiddleware, idValidator, postInputDtoValidation, inputValidationResultMiddleware, updatePostHandler)
    .delete("/:id", superAdminMiddleware, idValidator, inputValidationResultMiddleware, deletePostHandler);