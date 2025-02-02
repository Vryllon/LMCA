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

  const gddSum = () => {
    let sum = 0;
    for(let i = 0; i < avgTemperatures.length; i++){
      sum += calculateGDD(avgTemperatures[i]);
    }
    return Math.round(sum*100)/100;
  }

  const createTable = (avgTemperatures: number[], dateRange: string[]): JSX.Element[] => {
    return avgTemperatures.map((temp, index) => (
      <View style={styles.rows}>
        <Text style={styles.data} key={dateRange[index]}>{dateRange[index]}</Text>
        <Text style={styles.data} key={dateRange[index]}>{temp}</Text>
        <Text style={styles.data} key={dateRange[index]}>{calculateGDD(temp)}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.table}>
      <Text style={styles.tableTitle}>Growing Degree Day Calculation</Text>
      <Text style={styles.tableSubTitle}>Total GDD from {dateRange[0]} - {dateRange[dateRange.length-1]} : {gddSum()}</Text>
      <View style={styles.rows}>
        <Text style={styles.data}>Date</Text>
        <Text style={styles.data}>Average Temp</Text>
        <Text style={styles.data}>GDD</Text>
      </View>
      {createTable(avgTemperatures, dateRange)}
    </View>
  );
}

const styles = StyleSheet.create({
  data: {
    textAlign: "center",
    width: "33.4%",
    paddingVertical: 5,
    borderColor: 'black',
    borderWidth: 1,
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
    borderColor: 'black',
    borderWidth: 1,
    width: "90%",
    paddingTop: "5%",
  },
  list: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 1000,
    marginTop: 5,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  tableSubTitle: {
    fontSize: 16,
    fontWeight: 'semibold',
    textAlign: 'center',
    margin: 10,
  },
});
