
import { ValidationError } from "express-validator";
import { User } from "./db";
import { Request } from "express";

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
export interface RequestUser extends Request {
    user: User;
}