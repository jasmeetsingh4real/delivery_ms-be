import { dataSource } from "../db/datasource/app_data_source";
import { RestaurantStaffEntity } from "../entity/restaurantStaff.entity";
import { EnumStaffRoles } from "../types/staffTypes";
import { authHelper } from "../utils/authHelpers";
export class AuthService {
  static verifyPassword = async (loginDetails: {
    userName: string;
    password: string;
  }) => {
    const staffRepo = dataSource.getRepository(RestaurantStaffEntity);
    const userData = await staffRepo.findOne({
      where: {
        staffName: loginDetails.userName,
      },
    });
    if (!userData) {
      throw new Error("User not found");
    }

    const isPasswordValid = await authHelper.verifyPassword(
      userData.password,
      loginDetails.password
    );

    let token = undefined;
    if (userData.role === EnumStaffRoles.DELIVERY) {
      token = authHelper.getStaffAuthToken(userData);
    }
    if (userData.role === EnumStaffRoles.CHEF) {
      token = authHelper.getChefAuthToken(userData);
    }
    if (!token) {
      throw new Error("Something went wrong");
    }
    if (!isPasswordValid) {
      throw new Error("Invalid Password");
    }
    return { userData, token };
  };
}
