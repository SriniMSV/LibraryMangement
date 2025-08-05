package util;

import datalogic.UserSync;
import model.User;

public class AuthHelper {
    public static boolean isAdmin(int userId) {
        User user = new UserSync().getUserById(userId);
        return user != null && "ADMIN".equals(user.getRole());
    }
}
