package servlet;

import datalogic.BorrowSync;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import model.User;
import org.json.JSONObject;
import util.AuthHelper;

import java.io.*;

public class BorrowServlet extends HttpServlet {
    private final BorrowSync dao = new BorrowSync();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();


        // 🛡️ Get session and validate user
//        HttpSession session = req.getSession(false); // Don't create a new session
//        if (session == null || session.getAttribute("user") == null) {
//            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            out.println("{\"error\": \"User not logged in\"}");
//            return;
//        }

        try {
            BufferedReader reader = req.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            JSONObject jsonRequest = new JSONObject(sb.toString());

            int userId = jsonRequest.getInt("userId");
            int bookId = jsonRequest.getInt("bookId");
            String dueDate = jsonRequest.getString("dueDate");
            boolean success = dao.borrowBook(userId, bookId, dueDate);
            out.println("{\"message\": \"" + (success ? "Book borrowed" : "Borrow failed") + "\"}");

        } catch (Exception e) {
            out.println("{\"error\": \"Invalid request format\"}");
            e.printStackTrace();
        }
    }

    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();


        // 🛡️ Get session and validate user
//        HttpSession session = req.getSession(false); // Don't create a new session
//        if (session == null || session.getAttribute("user") == null) {
//            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            out.println("{\"error\": \"User not logged in\"}");
//            return;
//        }

        try {
            BufferedReader reader = req.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            JSONObject jsonRequest = new JSONObject(sb.toString());

            int recordId = jsonRequest.getInt("recordId");
            boolean success = dao.returnBook(recordId);
            out.println("{\"message\": \"" + (success ? "Book returned" : "Return failed") + "\"}");

        } catch (Exception e) {
            out.println("{\"error\": \"Invalid request format\"}");
            e.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        int requesterId = Integer.parseInt(req.getParameter("userId"));

        boolean isAdmin = AuthHelper.isAdmin(requesterId);


        // 🛡️ Get session and validate user
//        HttpSession session = req.getSession(false); // Don't create a new session
//        if (session == null || session.getAttribute("user") == null) {
//            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            out.println("{\"error\": \"User not logged in\"}");
//            return;
//        }

        String records;
        if (!isAdmin ) {
            records  = new BorrowSync().getBorrowHistory(requesterId);
        }
        else{
            records = new BorrowSync().getFullHistory();
        }

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        out.println(records); // Should already be JSON formatted string
    }
}