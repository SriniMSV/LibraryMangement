package model;

import java.util.Date;

public class Book {
    private int id;
    private String title;
    private String author;
    private int totalCopies;
    private int availableCopies;
    private String isbn;
    private String genre;
    private String description;
    private boolean available;
    private String imageUrl;
    private String addedBy;
    private Date addedDate;


    // CREATE TABLE books (id INT PRIMARY KEY AUTO_INCREMENT,title VARCHAR(150),author VARCHAR(100),total_copies INT,available_copies INT);

    // Default constructor
    public Book() {}

    // Constructor for basic book info
    public Book(int id, String title, String author, int totalCopies, int availableCopies) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
    }


    // Optional: Full constructor
    public Book(int id, String title, String author, int totalCopies, int availableCopies,
                String isbn, String genre, String description, boolean available,
                String imageUrl, String addedBy, Date addedDate) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
        this.isbn = isbn;
        this.genre = genre;
        this.description = description;
        this.available = available;
        this.imageUrl = imageUrl;
        this.addedBy = addedBy;
        this.addedDate = addedDate;
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public int getTotalCopies() {
        return totalCopies;
    }

    public int getAvailableCopies() {
        return availableCopies;
    }

    public String getIsbn() {
        return isbn;
    }

    public String getGenre() {
        return genre;
    }

    public String getDescription() {
        return description;
    }

    public boolean isAvailable() {
        return available;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getAddedBy() {
        return addedBy;
    }

    public Date getAddedDate() {
        return addedDate;
    }

    // Setters
    public void setId(int id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setTotalCopies(int totalCopies) {
        this.totalCopies = totalCopies;
    }

    public void setAvailableCopies(int availableCopies) {
        this.availableCopies = availableCopies;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setAddedBy(String addedBy) {
        this.addedBy = addedBy;
    }

    public void setAddedDate(Date addedDate) {
        this.addedDate = addedDate;
    }
}
