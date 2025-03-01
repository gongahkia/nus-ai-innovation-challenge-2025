import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { LineChart, PieChart, BarChart, ProgressChart } from 'react-native-chart-kit';

const AnalyticsScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [20, 45, 28, 80, 99, 43] }],
  };

  const pieData = [
    { name: "Pasta", population: 215, color: "rgba(131, 167, 234, 1)", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "Sauce", population: 280, color: "#F00", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "Cheese", population: 527, color: "rgb(0, 0, 255)", legendFontColor: "#7F7F7F", legendFontSize: 15 },
  ];

  const revenueData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [{ data: [15000, 22000, 18000, 25000] }],
  };

  const stockData = [
    { day: "Mon", price: "$150" },
    { day: "Tue", price: "$155" },
    { day: "Wed", price: "$158" },
    { day: "Thu", price: "$162" },
    { day: "Fri", price: "$165" },
  ];

  const progressData = {
    labels: ["Growth", "Customer Retention", "New Markets"],
    data: [0.8, 0.7, 0.6],
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Company Analytics Dashboard</Text>

      {/* Line Chart */}
      <LineChart
        data={salesData}
        width={Dimensions.get("window").width - 40}
        height={220}
        yAxisLabel="$"
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

      {/* Pie Chart */}
      <Text style={styles.subtitle}>Product Sales Distribution</Text>
      <PieChart
        data={pieData}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 50]}
        absolute
      />

      {/* Bar Chart */}
      <Text style={styles.subtitle}>Quarterly Revenue</Text>
      <BarChart
        data={revenueData}
        width={Dimensions.get("window").width - 40}
        height={220}
        yAxisLabel="$"
        chartConfig={chartConfig}
        style={styles.chart}
      />

      {/* Progress Chart */}
      <Text style={styles.subtitle}>Company Growth Metrics</Text>
      <ProgressChart
        data={progressData}
        width={Dimensions.get("window").width - 40}
        height={220}
        strokeWidth={16}
        radius={32}
        chartConfig={chartConfig}
        hideLegend={false}
        style={styles.chart}
      />

      {/* Stock Data Table */}
      <Text style={styles.subtitle}>Stock Price Trends</Text>
      <View style={styles.table}>
        {stockData.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{item.day}</Text>
            <Text style={styles.cell}>{item.price}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

// Chart Configuration
const chartConfig = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#fb8c00",
  backgroundGradientTo: "#ffa726",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  table: {
    width: Dimensions.get("window").width - 40,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AnalyticsScreen;