package com.yipee.yipee.Export;

import java.io.FileWriter;
import java.io.IOException;
import java.sql.*;
import com.opencsv.CSVWriter;

public class DatabaseToCSVExporter {
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/your_database";
    // insert JDBC username and password
    private static final String JDBC_USER = "your_username";
    private static final String JDBC_PASSWORD = "your_password";

    private static final String ITEM_BATCH_CSV_FILE_PATH = "item_batch_output.csv";
    private static final String SALES_DATA_CSV_FILE_PATH = "sales_data_output.csv";
    private static final String ALL_SALES_DATA_CSV_FILE_PATH = "all_sales_data_output.csv";

    public static void exportTableToCSV(String tableName, String csvFilePath, Long companyId) {
        String query = "SELECT * FROM " + tableName + " WHERE company_id = " + companyId;
        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query);
             CSVWriter writer = new CSVWriter(new FileWriter(csvFilePath))) {

            // Write column headers
            ResultSetMetaData metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();
            String[] header = new String[columnCount];

            for (int i = 1; i <= columnCount; i++) {
                header[i - 1] = metaData.getColumnName(i);
            }
            writer.writeNext(header);

            // Write rows from ResultSet
            while (rs.next()) {
                String[] row = new String[columnCount];
                for (int i = 1; i <= columnCount; i++) {
                    row[i - 1] = rs.getString(i);
                }
                writer.writeNext(row);
            }

            System.out.println("Data exported to " + csvFilePath);
        } catch (SQLException | IOException e) {
            e.printStackTrace();
        }
    }

    public static void exportAllSalesDataToCSV() {
        String query = "SELECT * FROM sales_data";
        try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query);
             CSVWriter writer = new CSVWriter(new FileWriter(ALL_SALES_DATA_CSV_FILE_PATH))) {

            // Write column headers
            ResultSetMetaData metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();
            String[] header = new String[columnCount];

            for (int i = 1; i <= columnCount; i++) {
                header[i - 1] = metaData.getColumnName(i);
            }
            writer.writeNext(header);

            // Write rows from ResultSet
            while (rs.next()) {
                String[] row = new String[columnCount];
                for (int i = 1; i <= columnCount; i++) {
                    row[i - 1] = rs.getString(i);
                }
                writer.writeNext(row);
            }

            System.out.println("All SalesData exported to " + ALL_SALES_DATA_CSV_FILE_PATH);
        } catch (SQLException | IOException e) {
            e.printStackTrace();
        }
    }

    public static void exportItemBatchToCSV(Long companyId) {
        exportTableToCSV("item_batch", ITEM_BATCH_CSV_FILE_PATH, companyId);
    }

    public static void exportSalesDataToCSV(Long companyId) {
        exportTableToCSV("sales_data", SALES_DATA_CSV_FILE_PATH, companyId);
    }
}
