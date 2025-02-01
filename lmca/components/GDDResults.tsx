import { View, StyleSheet, Text } from "react-native";

type GDDResultsProps = {
  avgTemperatures: Array<number>;
  base: any;
};

export default function GDDResults({ avgTemperatures, base }: GDDResultsProps) {

  const handleTempType = (temp : number) => {
    if(base <= 10)
      return Math.round(((temp - 32) * 5/9)*10)/10
    return temp
  }

  const calculateGDD = (avgTemperature : number) => {
    let gdd = Math.round((handleTempType(avgTemperature)-handleTempType(base))*100)/100
    if(gdd < 0)
      return 0
    return gdd
  }

  const createTable = () => {
    return avgTemperatures.map((temp : any , index : any) => (
      <Text key={index}>{calculateGDD(temp)}</Text>  // Ensure each item has a unique key
    ));
  };

  return (
    <View style={styles.columns}>
      <Text>Growing Degree Day Calculation</Text>
      {createTable()}
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
