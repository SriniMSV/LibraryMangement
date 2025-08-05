package datalogic;

import model.Book;
import util.DBConnection;

import java.sql.*;
import java.util.*;

public class BookSync {

    public List<Book> getAllBooks() {
        List<Book> books = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "SELECT * FROM books";
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Book book = new Book(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("author"),
                        rs.getInt("total_copies"),
                        rs.getInt("available_copies"),
                        rs.getString("isbn"),
                        rs.getString("genre"),
                        rs.getString("description"),
                        rs.getBoolean("available"),
                        rs.getString("imageUrl"),
                        rs.getString("addedBy"),
                        rs.getTimestamp("addedDate")
                );
                books.add(book);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return books;
    }

    public boolean addBook(Book book) {
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "INSERT INTO books (title, author, total_copies, available_copies, isbn, genre, description, available, imageUrl, addedBy, addedDate) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, book.getTitle());
            stmt.setString(2, book.getAuthor());
            stmt.setInt(3, book.getTotalCopies());
            stmt.setInt(4, book.getAvailableCopies());
            stmt.setString(5, book.getIsbn());
            stmt.setString(6, book.getGenre());
            stmt.setString(7, book.getDescription());
            stmt.setBoolean(8, book.isAvailable());
            stmt.setString(9, (book.getImageUrl()!=null) ? book.getImageUrl() : "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400" );
            stmt.setString(10, book.getAddedBy());
            stmt.setTimestamp(11, new Timestamp(book.getAddedDate().getTime()));
            return stmt.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateAvailability(int bookId, int newAvailable) {
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "UPDATE books SET available_copies=? WHERE id=?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, newAvailable);
            stmt.setInt(2, bookId);
            return stmt.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateStock(int bookId, int availableCopies, int totalCopies) {
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "UPDATE books SET available_copies=?, total_copies=?  WHERE id=? ";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, availableCopies);
            stmt.setInt(2, totalCopies);
            stmt.setInt(3, bookId);
            return stmt.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public Book getBookById(int id) {
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "SELECT * FROM books WHERE id = ?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new Book(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getString("author"),
                        rs.getInt("total_copies"),
                        rs.getInt("available_copies"),
                        rs.getString("isbn"),
                        rs.getString("genre"),
                        rs.getString("description"),
                        rs.getBoolean("available"),
                        rs.getString("imageUrl"),
                        rs.getString("addedBy"),
                        rs.getTimestamp("addedDate")
                );
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean deleteBook(int bookId) {
        try (Connection conn = DBConnection.getConnection()) {
            String sql = "DELETE FROM books WHERE id=?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, bookId);
            return stmt.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
