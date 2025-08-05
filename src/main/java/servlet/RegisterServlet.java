package servlet;

import datalogic.UserSync;
import model.User;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.json.JSONObject;

import java.io.*;

public class RegisterServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        try {
            // Read JSON from request body
            BufferedReader reader = req.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);

            JSONObject jsonRequest = new JSONObject(sb.toString());

            User user = new User();
            user.setName(jsonRequest.getString("name"));
            user.setEmail(jsonRequest.getString("email"));
            user.setPassword(jsonRequest.getString("password"));
            user.setUsername(jsonRequest.getString("username"));

            System.out.println("Registering user: " + user.getName() + ", " + user.getEmail());

            UserSync dao = new UserSync();
            boolean success = dao.registerUser(user);

            if (success) {
                out.println("{\"status\":\"success\",\"message\":\"User registered successfully\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("{\"status\":\"error\",\"message\":\"Registration failed\"}");
            }

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("{\"status\":\"error\",\"message\":\"Invalid request format\"}");
        }
    }
}
