export function createHttpError(status: number, message: string) {
  const error = new Error(message) as Error & { status?: number; expose?: boolean };
  error.status = status;
  error.expose = status < 500;
  return error;
}
