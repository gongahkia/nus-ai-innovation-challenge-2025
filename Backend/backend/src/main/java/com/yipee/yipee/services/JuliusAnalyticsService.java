package com.yipee.yipee.services;

import com.yipee.yipee.dto.AnalysisResult;
import com.yipee.yipee.dto.JuliusApiResponse;
import org.apache.http.client.methods.*;
import org.apache.http.entity.*;
import org.apache.http.impl.client.*;
import org.apache.http.util.EntityUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.FileReader;
import com.opencsv.CSVReader;

public class JuliusAnalyticsService {
    private static final String JULIUS_API_URL = "https://api.julius.ai/v1/analyze";
    private static final String API_KEY = System.getenv("JULIUS_API_KEY");

    public AnalysisResult analyzeCSV(String csvPath) throws Exception {
        // Read CSV data
        String csvData = readCSVFile(csvPath);
        
        // Construct API request payload
        String analysisPrompt = "Carry out data analysis. Format it in a manner that is clear and easily understood by business owners. "
                + "Firstly, provide a high-level overview of the data and other useful metrics. "
                + "Next, analyze the transaction data to derive actionable insights. "
                + "Lastly, identify any trends that may be helpful for the business.";
        String jsonPayload = String.format("{\"csv_data\": \"%s\", \"prompt\": \"%s\"}",
                escapeJsonString(csvData), escapeJsonString(analysisPrompt));

        // Execute API call
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost request = new HttpPost(JULIUS_API_URL);
        request.setHeader("Content-Type", "application/json");
        request.setHeader("Authorization", "Bearer " + API_KEY);
        request.setEntity(new StringEntity(jsonPayload));

        try (CloseableHttpResponse response = httpClient.execute(request)) {
            String responseBody = EntityUtils.toString(response.getEntity());
            return parseAnalysisResponse(responseBody);
        }
    }

    private static String readCSVFile(String filePath) throws Exception {
        StringBuilder csvContent = new StringBuilder();
        try (CSVReader reader = new CSVReader(new FileReader(filePath))) {
            String[] nextLine;
            while ((nextLine = reader.readNext()) != null) {
                csvContent.append(String.join(",", nextLine)).append("\n");
            }
        }
        return csvContent.toString();
    }

    private static AnalysisResult parseAnalysisResponse(String jsonResponse) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JuliusApiResponse apiResponse = mapper.readValue(jsonResponse, JuliusApiResponse.class);
        
        return new AnalysisResult(
            apiResponse.getOverview(),
            apiResponse.getKeyInsights(),
            apiResponse.getTrends(),
            apiResponse.getBusinessMetrics()
        );
    }

    private static String escapeJsonString(String input) {
        return input.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }
}
