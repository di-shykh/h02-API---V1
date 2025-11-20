import {ValidationError} from "./ValidationError";

export const createErrorMessages = (errors: ValidationError[]): { errorsMessages: ValidationError[] } => {
    return { errorsMessages: errors };
}