import { View, StyleSheet, Text } from "react-native";

type GDDResultsProps = {
  high: any;
  low: any;
  base: any;
};

export default function GDDResults({ high, low, base }: GDDResultsProps) {

  const handleDisplayTemp = (temp : number) => {
    if(base > 10)
      return Math.round((temp * 9/5 + 32)*10)/10
    return temp
  }

  const calculateGDD = (high : number, low : number) => {
    let gdd = Math.round(((high+low)/2-base)*10)/10
    if(gdd < 0)
      return 0
    return gdd
  }

  const renderData = () => {
    if(high == null){
        high = [0]
        low = [0]
    }
    return high.map((item : any, index : any) => (
      <Text key={index}>
        {handleDisplayTemp(item)}               {handleDisplayTemp(low[index])}               {calculateGDD(handleDisplayTemp(item), handleDisplayTemp(low[index]))}
      </Text>
    ));
  };

  return (
    <View style={styles.columns}>
      <Text>Some Data Results or something</Text>
      <Text>High              Low              GDD</Text>
      <View>{renderData()}</View>
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
