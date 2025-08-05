package servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import model.User;
import org.json.JSONObject;
import util.DBConnection;

import java.io.*;
import java.sql.*;

public class LoginServlet extends HttpServlet {

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setStatus(HttpServletResponse.SC_OK); // CORS handled by global filter
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        try {
            // Parse JSON request body
            BufferedReader reader = req.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            JSONObject jsonRequest = new JSONObject(sb.toString());

            String email = jsonRequest.getString("email");
            String password = jsonRequest.getString("password");

            try (Connection conn = DBConnection.getConnection()) {
                String sql = "SELECT * FROM users WHERE email = ? AND password = ?";
                PreparedStatement stmt = conn.prepareStatement(sql);
                stmt.setString(1, email);
                stmt.setString(2, password);
                ResultSet rs = stmt.executeQuery();

                if (rs.next()) {
                    User user = new User();
                    user.setId(rs.getInt("id"));
                    user.setEmail(rs.getString("email"));
                    user.setRole(rs.getString("role"));

                    HttpSession session = req.getSession();
                    session.setAttribute("user", user);

                    JSONObject jsonResponse = new JSONObject();
                    jsonResponse.put("status", "success");
                    jsonResponse.put("email", user.getEmail());
                    jsonResponse.put("role", user.getRole());
                    jsonResponse.put("userId", user.getId());

                    out.print(jsonResponse.toString());
                } else {
                    resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    out.print("{\"status\":\"error\",\"message\":\"Invalid credentials\"}");
                }

            } catch (SQLException e) {
                e.printStackTrace();
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"status\":\"error\",\"message\":\"Database error\"}");
            }

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\",\"message\":\"Invalid request format\"}");
        }
    }
}
