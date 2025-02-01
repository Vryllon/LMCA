import { View, StyleSheet, Text } from "react-native";

type GDDResultsProps = {
  avgTemperature: number;
  base: any;
};

export default function GDDResults({ avgTemperature, base }: GDDResultsProps) {

  const handleTempType = (temp : number) => {
    if(base > 10)
      return Math.round((temp * 9/5 + 32)*10)/10
    return temp
  }

  const calculateGDD = (avgTemperature : number) => {
    let gdd = Math.round((avgTemperature-base)*100)/100
    if(gdd < 0)
      return 0
    return gdd
  }

  return (
    <View style={styles.columns}>
      <Text>Average Temperature</Text>
      <Text>{handleTempType(Math.round((avgTemperature)*100)/100)}</Text>
      <Text>Growing Degree Day Calculation</Text>
      <Text>{calculateGDD(handleTempType(avgTemperature))}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  columns: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  rows: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  list: {
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 1000,
    marginTop: 5,
  },
});
