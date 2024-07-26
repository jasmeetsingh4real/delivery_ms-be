import { loginDetailsSchema } from "../schemas/userSchemas";
import { AuthService } from "../services/authService";

export class AuthController {
  static loginUser = async (req, res) => {
    try {
      const verifiedDetails = loginDetailsSchema.safeParse(req.body);
      if (!verifiedDetails.success) {
        throw new Error("Invalid UserName or Password");
      }
      const { userData, token } = await AuthService.verifyPassword({
        email: verifiedDetails.data.email,
        password: verifiedDetails.data.password,
      });

      delete userData.password;

      res.cookie("staffAuthToken", token);
      return res.json({
        result: userData,
        success: true,
        errorMessage: null,
      });
    } catch (err: any) {
      return res.json({
        result: null,
        success: false,
        errorMessage: err.message || "something went wrong",
      });
    }
  };

  static verifyStaffAuthToken = async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        throw new Error("Token not found");
      }
      const verifiedTokenRes = await AuthService.verifyStaffAuthToken(token);
      if (!verifiedTokenRes) {
        throw new Error("Invalid Auth-Token!");
      }

      return res.json({
        result: "Token verified!",
        success: true,
        errorMessage: null,
      });
    } catch (error) {
      return res.json({
        result: null,
        success: false,
        errorMessage: error.message || "something went wrong",
      });
    }
  };
}
