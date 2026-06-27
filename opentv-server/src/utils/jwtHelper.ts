import jwt from "jsonwebtoken";
const generateToken = (
  payload: string | object | Buffer,
  secret: string | Buffer,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  });
  return token;
};

const decodedToken = (payload: any, secret: string) => {
  const decoded = jwt.verify(payload, secret);
  return decoded;
};

export const jwtHelper = {
  generateToken,
  decodedToken,
};
