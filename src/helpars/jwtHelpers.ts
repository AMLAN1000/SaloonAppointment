// src/helpers/jwtHelpers.ts
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const generateToken = (
  payload: { userId: string; email: string; role: string },
  secret: Secret,
  expiresIn: string,
): string => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });

  return token;
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
