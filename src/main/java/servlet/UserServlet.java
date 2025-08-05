package servlet;

import datalogic.UserSync;
import model.Book;
import model.User;
import org.json.JSONObject;
import util.AuthHelper;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.*;
import java.util.List;

public class UserServlet extends HttpServlet {
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        int adminId = Integer.parseInt(req.getParameter("adminId"));
        int targetUserId = Integer.parseInt(req.getParameter("userId"));

        if (!AuthHelper.isAdmin(adminId)) {
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Admin only");
            return;
        }

        boolean result = new UserSync().makeAdmin(targetUserId);
        resp.setContentType("application/json");
        resp.getWriter().println("{\"message\": \"" + (result ? "User promoted to Admin" : "Operation failed") + "\"}");
    }

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        int loginAdmin = Integer.parseInt(req.getParameter("currentUserId"));

        if (!AuthHelper.isAdmin(loginAdmin)) {
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Admin access only");
            return;
        }

        List<User> users = new UserSync().getAllUsers(loginAdmin);

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        out.println("[");
        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            out.print(String.format(
                    "{\"id\": %d, \"name\": \"%s\", \"username\": \"%s\", \"email\": \"%s\", \"role\": \"%s\"}%s",
                    user.getId(),
                    escape(user.getName()),
                    escape(user.getUsername()),
                    escape(user.getEmail()),
                    escape(user.getRole().toLowerCase()),
                    i < users.size() - 1 ? "," : ""
            ));
        }
        out.println("]");
    }

    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        try{

            // Read JSON from request body
            BufferedReader reader = req.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);

            JSONObject jsonRequest = new JSONObject(sb.toString());

            int targetUserId = jsonRequest.getInt("userId");
            String role = (jsonRequest.getString("role").equalsIgnoreCase("ADMIN")) ? "ADMIN" : "USER";

            boolean result = new UserSync().updateUserRole(targetUserId,role);

            if (result) {
                out.println("{\"status\":\"success\",\"message\":\"User Role updated successfully\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("{\"status\":\"error\",\"message\":\"Role Update failed\"}");
            }

        }
        catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("{\"status\":\"error\",\"message\":\"Invalid request format\"}");
        }
    }

    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        try {

            // Read JSON from request body
            BufferedReader reader = req.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);

            JSONObject jsonRequest = new JSONObject(sb.toString());
            int targetUserId = jsonRequest.getInt("userId");

            boolean result = new UserSync().deleteUser(targetUserId);

            if (result) {
                out.println("{\"status\":\"success\",\"message\":\"User Removed successfully\"}");
            } else {

                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("{\"status\":\"error\",\"message\":\"This User haven't Return some books. Kindly check in Rental List before deleting the user.\"}");
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("{\"status\":\"error\",\"message\":\"Invalid request format\"}");
        }
    }

    private String escape(String str) {
        return str == null ? "" : str.replace("\"", "\\\"");
    }
}
