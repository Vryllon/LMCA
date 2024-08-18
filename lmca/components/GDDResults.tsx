import { View, StyleSheet, Text, FlatList } from "react-native";


export default function GDDResults ({high, low} : any) {

    const data: ArrayLike<{ id: string; title: string; }> | null | undefined = [];


    const renderRow = ({ item } : { item: { id: string, title: string } }) => (
        <View style={styles.rows}>
            <Text>{item.title}</Text>
        </View>
    );

    return (

        <View style={styles.columns}>
            <Text>Some Data Results or something</Text>
            <FlatList
                style={styles.list}
                data={data}
                renderItem={renderRow}
                keyExtractor={(item) => item.id}
            />
        </View>

    )

}


const styles = StyleSheet.create({
    columns: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    rows: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    list: {
        borderWidth: 1,
        borderColor: '#ddd',
        maxHeight: 100,
        marginTop: 5,
    },
  });