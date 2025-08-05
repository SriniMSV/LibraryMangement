package model;

import java.util.Date;

public class BorrowRecord {
    private int id;             // Unique ID for the borrow record
    private int userId;         // ID of the user who borrowed the book
    private int bookId;         // ID of the borrowed book
    private Date borrowDate;    // When it was borrowed
    private Date dueDate;    // When it was borrowed
    private Date returnDate;    // When it was returned (null if not yet)
    private boolean returned;   // Whether the book has been returned

    // CREATE TABLE borrow_records (id INT PRIMARY KEY AUTO_INCREMENT,user_id INT,book_id INT,borrow_date DATE,return_date DATE,is_returned BOOLEAN DEFAULT FALSE,FOREIGN KEY (user_id) REFERENCES users(id),FOREIGN KEY (book_id) REFERENCES books(id));
    // Constructor
    public BorrowRecord(int id, int userId, int bookId, Date borrowDate, Date dueDate,Date returnDate, boolean returned) {
        this.id = id;
        this.userId = userId;
        this.bookId = bookId;
        this.borrowDate = borrowDate;
        this.returnDate = returnDate;
        this.dueDate = dueDate;
        this.returned = returned;
    }

    // Default constructor
    public BorrowRecord() {}

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getBookId() {
        return bookId;
    }

    public void setBookId(int bookId) {
        this.bookId = bookId;
    }

    public Date getBorrowDate() {
        return borrowDate;
    }

    public void setBorrowDate(Date borrowDate) {
        this.borrowDate = borrowDate;
    }

    public Date getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(Date returnDate) {
        this.returnDate = returnDate;
    }

    public boolean isReturned() {
        return returned;
    }

    public void setReturned(boolean returned) {
        this.returned = returned;
    }

    @Override
    public String toString() {
        return "BorrowRecord{" +
                "id=" + id +
                ", userId=" + userId +
                ", bookId=" + bookId +
                ", borrowDate=" + borrowDate +
                ", returnDate=" + returnDate +
                ", dueDate=" + dueDate +
                ", returned=" + returned +
                '}';
    }
}
