import { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data?: T | null;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const response: any = {
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
  };

  // Only add meta if it exists
  if (data.meta) {
    response.meta = data.meta;
  }

  // Always include data field (even if null)
  response.data = data.data !== undefined ? data.data : null;

  res.status(data.statusCode).json(response);
};

export default sendResponse;
