import { ValidationError } from "express-validator";

export interface User {
    id?: number;
    username: string;
    password?: string;
}

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