import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, ScrollView, Button  } from 'react-native';
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
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Button title="Back" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Your Latest Analytics</Text>

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
    </ScrollView>
  );
};

// Chart Configuration
const chartConfig = {
  backgroundColor: "#689d6a",
  backgroundGradientFrom: "#689d6a",
  backgroundGradientTo: "#689d6a",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(251, 241, 199, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(60, 56, 54, ${opacity})`,
  style: { 
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#3c3836',
  },
  propsForDots: { 
    r: "6", 
    strokeWidth: "2", 
    stroke: "#3c3836" 
  },
};

// Styles
const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fbf1c7', 
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#3c3836',
    textShadow: '4px 4px 0 #cc241d',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    color: '#3c3836',
  },
  chart: {
    marginVertical: 20,
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#3c3836',
  },
  table: {
    width: Dimensions.get("window").width - 40,
    marginTop: 20,
    borderWidth: 4,
    borderColor: "#3c3836",
    borderRadius: 0,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 4,
    borderBottomColor: "#3c3836",
    backgroundColor: '#ebdbb2',
  },
  cell: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#3c3836',
  },
});

export default AnalyticsScreen;