import jwt = require("jsonwebtoken");
export const decryptForServer = (encryptedData: any) => {
  const decoded = jwt.verify(encryptedData, process.env.JWT_SERVER_SECRET_KEY);
  if (!decoded) {
    throw new Error("Invalid data");
  }
  return decoded;
};
