abstract class ApiError extends Error {
  abstract statusCode: number
}

export class ValidationError extends ApiError {
  statusCode = 400
}
