package datalogic;

import model.User;
import util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserSync {
    public boolean registerUser(User user) {
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "INSERT INTO users(name, username, email, password, role) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, user.getName());
            stmt.setString(2, user.getUsername());
            stmt.setString(3, user.getEmail());
            stmt.setString(4, user.getPassword());
            stmt.setString(5, "USER");
            return stmt.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean makeAdmin(int userId) {
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "UPDATE users SET role='ADMIN' WHERE id=?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            return stmt.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateUserRole(int userId, String role) {
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "UPDATE users SET role= ? WHERE id=?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, role);
            stmt.setInt(2, userId);
            return stmt.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteUser(int userId) {
        try (Connection conn = DBConnection.getConnection()) {

            String sql = "SELECT * FROM borrow_records WHERE user_id = ? AND is_returned = 0";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();
            if(rs.next()){
                return false;
            }
            else{
                sql = "DELETE FROM borrow_records WHERE user_id = ?";
                stmt = conn.prepareStatement(sql);
                stmt.setInt(1, userId);
                stmt.executeUpdate();
            }

            sql = "DELETE FROM users WHERE id = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            return stmt.executeUpdate() > 0;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public User getUserById(int id) {
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "SELECT * FROM users WHERE id=?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                User u = new User();
                u.setId(rs.getInt("id"));
                u.setName(rs.getString("name"));
                u.setUsername(rs.getString("username"));
                u.setEmail(rs.getString("email"));
                u.setRole(rs.getString("role"));
                return u;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<User> getAllUsers( int loginAdmin) {
        List<User> users = new ArrayList<>();
        String query = "SELECT * FROM users WHERE id!="+loginAdmin;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                User user = new User();
                user.setId(rs.getInt("id"));
                user.setName(rs.getString("name"));
                user.setUsername(rs.getString("username"));
                user.setEmail(rs.getString("email"));
                user.setRole(rs.getString("role"));

                users.add(user);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return users;
    }
}

