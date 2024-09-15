import { View, Text, StyleSheet, Image } from "react-native";
import { COLORS } from "../styles/constants";
import climbingKoala from "../assets/climbingKoala.png";

const ProgressChart = ({ data = [] }) => {
  const maxBarHeight = 150;

  const maxPages = Math.max(...data.map((entry) => entry.pages), 1);

  return (
    <>
      <View
        style={{
          backgroundColor: COLORS.paragraphDark,
          height: 1,
          width: "100%",
        }}
      ></View>
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          {data.map((entry, index) => {
            const barHeight =
              maxPages > 0 ? (entry.pages / maxPages) * maxBarHeight : 0;
            return (
              <View key={index} style={styles.barContainer}>
                <Text style={styles.pageText}>{entry.pages}</Text>
                <View style={[styles.bar, { height: barHeight }]}>
                  {barHeight > 0 && (
                    <Image
                      source={climbingKoala}
                      style={[styles.icon, { bottom: barHeight - 20 }]}
                    />
                  )}
                </View>
                <Text style={styles.dayText}>{entry.day}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "120%",
    alignItems: "flex-end",
    height: 200,
    marginTop: 20,
  },
  barContainer: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  bar: {
    width: 25,
    backgroundColor: COLORS.primary,
    marginBottom: 5,
    position: "relative",
    borderRadius: 8,
  },
  icon: {
    width: 30,
    height: 40,
    position: "absolute",
    left: "50%",
    transform: [{ translateY: 20 }, { translateX: 8 }],
  },
});
export default ProgressChart;
