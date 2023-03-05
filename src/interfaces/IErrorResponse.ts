/**
 * Used for error responses
 * @param status HTTP status code
 * @param message error message
 */
export interface IErrorResponse {
    status: number;
    message: string;
}