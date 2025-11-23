import {validationResult, ValidationError, FieldValidationError} from "express-validator";
import {Request, Response, NextFunction} from "express";
import {HttpStatus} from "../../types/http-statuses";
import {ValidationErrorType} from "../../types/validationError";
import {ValidationErrorDto} from "../../types/validationError.dto";

export const createErrorMessages = (errors: ValidationErrorType[]): ValidationErrorDto => {
    return { errorsMessages: errors };// обертывает массив ошибок в стандартный DTO
}

export const formatErrors = (error: ValidationError): ValidationErrorType => {
    const  expressError = error as unknown as FieldValidationError; // Приведение типа

    return {
        field: expressError.path, //извлекает путь к полю
        message: expressError.msg, //изв-ет сообщение об ошибке
    };
}

export const inputValidationResultMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //получаем ошибки валидации из запроса
    const errors = validationResult(req)
        .formatWith(formatErrors) //форматируем каждую ошибку
        .array({onlyFirstError: true});//берем только первую ошибку для каждого поля

    //если есть ошибки - отправляем ответ со статусом 400 и стандарт.json ответ
    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).json({errorsMessages: errors});
        return; //прерываем цепочку middleware
    }
    //если нет ошибок, то передаем управление дальше
    next();
}

// Типы из express-validator:
// ValidationError - базовый тип ошибки валидации
//
// FieldValidationError - ошибка конкретного поля с свойствами:
//
//     path - путь к полю
//
// msg - сообщение об ошибке
//
// location - где проверялось (body, query, params и т.д.)
