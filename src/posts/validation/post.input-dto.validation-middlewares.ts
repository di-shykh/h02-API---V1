import {body} from "express-validator";
import {blogsRepository} from "../../blogs/repositories/blogs.repository";

const titleValidation = body("title")
    .exists().withMessage("Title is required")
    .isString().withMessage("Title should be string")
    .trim()
    .isLength({min: 2, max: 30}).withMessage("Title should be min 2 characters long max 30");

const shortDescriptionValidation = body("shortDescription")
    .exists().withMessage("shortDescription is required")
    .isString().withMessage("shortDescription should be string")
    .trim()
    .isLength({min: 2, max: 100}).withMessage("shortDescription should be min 2 characters long max 100");
const contentValidation = body("content")
    .exists().withMessage("content is required")
    .isString().withMessage("content should be string")
    .trim()
    .isLength({min: 2, max: 1000}).withMessage("content should be min 2 characters long max 1000");
const blogIdValidation = body("blogId")
    .exists().withMessage("blogId is required")
    .isString().withMessage("blogId should be string")
    .trim()
    .isNumeric().withMessage("blogId should be numeric")
    .custom((id: string): boolean => {
        const blog = blogsRepository.findBlogById(id);
        if (!blog) {
            throw new Error("blogId does not exist");
        }
        return true;
    });
export const postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
];
