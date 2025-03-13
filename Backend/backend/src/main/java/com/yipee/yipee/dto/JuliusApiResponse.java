package com.yipee.yipee.dto;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

public class JuliusApiResponse {
    @JsonProperty("overview")
    private String overview;

    @JsonProperty("key_insights")
    private List<String> keyInsights;

    @JsonProperty("trends")
    private List<String> trends;

    @JsonProperty("business_metrics")
    private Map<String, Object> businessMetrics;

    public String getOverview() {
        return overview;
    }

    public List<String> getKeyInsights() {
        return keyInsights;
    }

    public List<String> getTrends() {
        return trends;
    }

    public Map<String, Object> getBusinessMetrics() {
        return businessMetrics;
    }
}
