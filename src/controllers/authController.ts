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
}
