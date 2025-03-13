package com.yipee.yipee.dto;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public class AnalysisResult {
    private final String overview;
    private final List<String> insights;
    private final List<String> trends;
    private final Map<String, Object> metrics;

    public AnalysisResult(String overview, List<String> insights, 
                         List<String> trends, Map<String, Object> metrics) {
        this.overview = overview;
        this.insights = List.copyOf(insights);
        this.trends = List.copyOf(trends);
        this.metrics = Map.copyOf(metrics);
    }

    public String getOverview() {
        return overview;
    }

    public List<String> getInsights() {
        return Collections.unmodifiableList(insights);
    }

    public List<String> getTrends() {
        return Collections.unmodifiableList(trends);
    }

    public Map<String, Object> getMetrics() {
        return Collections.unmodifiableMap(metrics);
    }
}
