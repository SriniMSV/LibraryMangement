package datalogic;

import model.BorrowRecord;
import util.DBConnection;
import java.sql.*;
import java.time.LocalDate;

public class BorrowSync {
    public boolean borrowBook(int userId, int bookId, String dueDate) {
        try (Connection conn = DBConnection.getConnection()) {
            BookSync bookDAO = new BookSync();
            var book = bookDAO.getBookById(bookId);
            if (book == null || book.getAvailableCopies() <= 0) return false;

            // Insert borrow record
            String sql = "INSERT INTO borrow_records(user_id, book_id, borrow_date, due_date, is_returned) VALUES (?, ?, ?, ?, false)";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            stmt.setInt(2, bookId);
            stmt.setDate(3, Date.valueOf(LocalDate.now()));
            stmt.setDate(4, Date.valueOf(dueDate));
            boolean inserted = stmt.executeUpdate() > 0;

            // Decrease available count
            bookDAO.updateAvailability(bookId, book.getAvailableCopies() - 1);

            return inserted;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean returnBook(int recordId) {
        try (Connection conn = DBConnection.getConnection()) {
            // Get record to update book count
            String fetch = "SELECT book_id FROM borrow_records WHERE id=? AND is_returned=false";
            PreparedStatement fstmt = conn.prepareStatement(fetch);
            fstmt.setInt(1, recordId);
            ResultSet rs = fstmt.executeQuery();
            if (!rs.next()) return false;

            int bookId = rs.getInt("book_id");

            // Mark as returned
            String sql = "UPDATE borrow_records SET is_returned=true, return_date=? WHERE id=?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setDate(1, Date.valueOf(LocalDate.now()));
            stmt.setInt(2, recordId);
            boolean updated = stmt.executeUpdate() > 0;

            // Increase book count
            BookSync dao = new BookSync();
            var book = dao.getBookById(bookId);
            dao.updateAvailability(bookId, book.getAvailableCopies() + 1);

            return updated;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public String getBorrowHistory(int userId) {
        StringBuilder sb = new StringBuilder("[");
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "SELECT br.*, b.title, u.email FROM borrow_records br JOIN books b ON br.book_id = b.id JOIN users u ON br.user_id = u.id WHERE br.user_id=?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                sb.append(String.format(
                        "{\"id\":%d,\"bookTitle\":\"%s\",\"rentalDate\":\"%s\",\"returnDate\":\"%s\",\"isReturned\":%b,\"userId\":\"%s\",\"bookId\":\"%s\",\"dueDate\":\"%s\",\"email\":\"%s\"},",
                        rs.getInt("id"), rs.getString("title"),
                        rs.getDate("borrow_date"), rs.getDate("return_date"),
                        rs.getBoolean("is_returned"),String.valueOf(rs.getInt("user_id")),
                        String.valueOf(rs.getInt("book_id")),rs.getDate("due_date"),
                        rs.getString("email")
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (sb.length() > 1) sb.setLength(sb.length() - 1); // remove last comma
        sb.append("]");
        return sb.toString();
    }

    public String getFullHistory() {
        StringBuilder sb = new StringBuilder("[");
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "SELECT br.*, b.title, u.email FROM borrow_records br JOIN books b ON br.book_id = b.id JOIN users u ON br.user_id = u.id";
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                sb.append(String.format(
                        "{\"id\":%d,\"bookTitle\":\"%s\",\"rentalDate\":\"%s\",\"returnDate\":\"%s\",\"isReturned\":%b,\"userId\":\"%s\",\"bookId\":\"%s\",\"dueDate\":\"%s\",\"email\":\"%s\"},",
                        rs.getInt("id"), rs.getString("title"),
                        rs.getDate("borrow_date"), rs.getDate("return_date"),
                        rs.getBoolean("is_returned"),String.valueOf(rs.getInt("user_id")),
                        String.valueOf(rs.getInt("book_id")),rs.getDate("due_date"),
                        rs.getString("email")
                ));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        if (sb.length() > 1) sb.setLength(sb.length() - 1); // remove last comma
        sb.append("]");
        return sb.toString();
    }

}

