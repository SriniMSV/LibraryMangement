package servlet;

import datalogic.BookSync;
import datalogic.UserSync;
import model.Book;
import org.json.JSONObject;
import util.AuthHelper;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import util.DBConnection;

import java.io.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.*;

public class BookServlet extends HttpServlet {
    private BookSync dao = new BookSync();
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

//        // Get existing session (do not create new one)
//        HttpSession session = req.getSession(false);
//
//        // Verify session and user
//        if (session == null || session.getAttribute("user") == null) {
//            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            resp.setContentType("application/json");
//            resp.getWriter().println("{\"error\": \"Unauthorized access. Please login.\"}");
//            return;
//        }

        List<Book> books = dao.getAllBooks();

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        out.println("[");

        for (int i = 0; i < books.size(); i++) {
            Book b = books.get(i);
            out.printf(
                    "{\"id\": %d, \"title\": \"%s\", \"author\": \"%s\", \"isbn\": \"%s\", \"genre\": \"%s\", \"description\": \"%s\", \"available\": %s, \"totalCopies\": %d, \"availableCopies\": %d, \"imageUrl\": \"%s\", \"addedBy\": \"%s\", \"addedDate\": \"%s\"}%s",
                    b.getId(), escape(b.getTitle()), escape(b.getAuthor()), escape(b.getIsbn()), escape(b.getGenre()),
                    escape(b.getDescription()), b.isAvailable(), b.getTotalCopies(), b.getAvailableCopies(),
                    escape(b.getImageUrl()), escape(b.getAddedBy()),
                    (b.getAddedDate() != null ? dateFormat.format(b.getAddedDate()) : ""),
                    i < books.size() - 1 ? "," : ""
            );
        }



        out.println("]");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        // Read JSON from request body
        BufferedReader reader = req.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) sb.append(line);

        JSONObject jsonRequest = new JSONObject(sb.toString());

        boolean result = false;

            Book book = new Book();
            book.setTitle(jsonRequest.getString("title"));
            book.setAuthor(jsonRequest.getString("author"));
            book.setIsbn(jsonRequest.getString("isbn"));
            book.setGenre(jsonRequest.getString("genre"));
            book.setDescription(jsonRequest.getString("description"));
            book.setAvailable(jsonRequest.getBoolean("available"));
            book.setImageUrl(jsonRequest.getString("imageUrl"));
            book.setAddedBy(jsonRequest.getString("addedBy"));

            String dateStr = jsonRequest.getString("addedDate");
            if (dateStr != null && !dateStr.isEmpty()) {
                try {
                    book.setAddedDate(dateFormat.parse(dateStr));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            int copies = jsonRequest.getInt("totalCopies");
            book.setTotalCopies(copies);
            book.setAvailableCopies(copies);

            result = dao.addBook(book);


        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        out.println("{\"message\": \"" + (result ? "Success" : "Failed") + "\"}");
    }


    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        // Read JSON from request body
        BufferedReader reader = req.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) sb.append(line);

        JSONObject jsonRequest = new JSONObject(sb.toString());

//        int userId = Integer.parseInt(jsonRequest.getString("userId"));
//        if (!AuthHelper.isAdmin(userId)) {
//            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Admin access required");
//            return;
//        }

        boolean result = false;

        int bookId = jsonRequest.getInt("id");
        int availableCopies = jsonRequest.getInt("availableCopies");
        int totalCopies = jsonRequest.getInt("totalCopies");
        result = dao.updateStock(bookId, availableCopies, totalCopies);


        out.println("{\"message\": \"" + (result ? "Success" : "Failed") + "\"}");
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
            int bookId = jsonRequest.getInt("bookId");

            boolean result = dao.deleteBook(bookId);

            if (result) {
                out.println("{\"status\":\"success\",\"message\":\"Book Removed successfully\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("{\"status\":\"error\",\"message\":\"Book Remove failed\"}");
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
