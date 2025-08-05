package servlet;

import util.DBConnection;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;

public class TestConnectionServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        if (conn != null) {
            out.println("<h2>Database Connection SUCCESS!</h2>");
        } else {
            out.println("<h2 style='color:red;'>Database Connection FAILED!</h2>");
        }
    }
}
