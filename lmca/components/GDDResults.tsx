import { View, StyleSheet, Text } from "react-native";

type GDDResultsProps = {
  high: any;
  low: any;
};

export default function GDDResults({ high, low }: GDDResultsProps) {
  const renderData = () => {
    if(high == null){
        high = [0]
        low = [0]
    }
    return high.map((item : any, index : any) => (
      <Text key={index}>
        {item}           {low[index]}
      </Text>
    ));
  };

  return (
    <View style={styles.columns}>
      <Text>Some Data Results or something</Text>
      <Text>High              Low</Text>
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
    maxHeight: 100,
    marginTop: 5,
  },
});
