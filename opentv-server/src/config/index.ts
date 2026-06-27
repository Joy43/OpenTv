import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  cloudnary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudnary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudnary_api_secret: process.env.CLOUDINARY_API_SECRET,
  email: {
    sender: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_APP_PASS,
  },
    reset_secret_key: process.env.RESET_SECRET_KEY,
  reset_expires_in: process.env.RESET_EXPIRES_IN,
  website_url: process.env.WEBSITE_URL,

};