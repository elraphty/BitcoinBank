
import { ValidationError } from "express-validator";

export interface DataResponse {
    msg: string;
    data: any;
}

export interface ErrorResponse {
    msg: string;
}

export interface ErrorValidationResponse {
    msg: string;
    errors: ValidationError[];
}