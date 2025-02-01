import { View, StyleSheet, Text } from "react-native";

type GDDResultsProps = {
  avgTemperatures: number[];
  dateRange: string[];
  base: any;
};

export default function GDDResults({ avgTemperatures, dateRange, base }: GDDResultsProps) {

  const handleTempType = (temp : number) => {
    if(base <= 10)
      return Math.round(((temp - 32) * 5/9)*100)/100
    return temp
  }

  const calculateGDD = (avgTemperature : number) => {
    let gdd = Math.round((handleTempType(avgTemperature)-handleTempType(base))*100)/100
    if(gdd < 0)
      return 0
    return gdd
  }

  const createTable = (avgTemperatures: number[], dateRange: string[]): JSX.Element[] => {
    return avgTemperatures.map((temp, index) => (
      <View style={styles.rows}>
        <Text style={styles.data} key={dateRange[index]}>{dateRange[index]}</Text>
        <Text style={styles.data} key={dateRange[index]}>{calculateGDD(temp)}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.table}>
      <Text>Growing Degree Day Calculation</Text>
      {createTable(avgTemperatures, dateRange)}
    </View>
  );
}

const styles = StyleSheet.create({
  data: {
    textAlign: "center",
    width: "40%",
    marginVertical: 5,
    marginHorizontal: "5%"
  },
  rows: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  table: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#ddd",
    width: "80%",
  },
  list: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 1000,
    marginTop: 5,
  },
});
