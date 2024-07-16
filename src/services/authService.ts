import { dataSource } from "../db/datasource/app_data_source";
import { RestaurantStaffEntity } from "../entity/restaurantStaff.entity";
import { EnumStaffRoles } from "../types/staffTypes";
import { authHelper } from "../utils/authHelpers";
export class AuthService {
  static verifyPassword = async (loginDetails: {
    email: string;
    password: string;
  }) => {
    const staffRepo = dataSource.getRepository(RestaurantStaffEntity);
    const userData = await staffRepo.findOne({
      where: {
        email: loginDetails.email,
      },
    });
    if (!userData) {
      throw new Error("User not found");
    }
    // TODO
    // const isPasswordValid = await authHelper.verifyPassword(
    //   userData.password,
    //   loginDetails.password
    // );
    if (userData.password !== loginDetails.password) {
      throw new Error("Invalid Password");
    }
    let token = undefined;
    if (userData.role === EnumStaffRoles.DELIVERY) {
      token = authHelper.getStaffAuthToken(userData);
    }
    if (userData.role === EnumStaffRoles.CHEF) {
      //change to getChefAuthToken if required
      token = authHelper.getStaffAuthToken(userData);
    }
    if (!token) {
      throw new Error("Something went wrong");
    }

    return { userData, token };
  };
}
