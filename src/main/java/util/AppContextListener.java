package util;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;

public class AppContextListener implements ServletContextListener {

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // Unregister JDBC drivers
        Enumeration<Driver> drivers = DriverManager.getDrivers();
        while (drivers.hasMoreElements()) {
            Driver driver = drivers.nextElement();
            try {
                DriverManager.deregisterDriver(driver);
                System.out.println("Deregistered JDBC driver: " + driver);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        // Shutdown MySQL cleanup thread
        com.mysql.cj.jdbc.AbandonedConnectionCleanupThread.checkedShutdown();
        System.out.println("MySQL AbandonedConnectionCleanupThread shut down.");
    }

//    @Override
//    public void contextInitialized(ServletContextEvent sce) {
//        // You can optionally log or initialize stuff here
//    }
}
