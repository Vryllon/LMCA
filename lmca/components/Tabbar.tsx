import { View, StyleSheet, Text, Button } from "react-native";
import ImageButton from "./ImageButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";


export default function Tabbar() {

    const handleLogout = () => {
        // Clear Async Storage
        AsyncStorage.clear();
        // Redirect to Login Screen
        router.push('/')
    }

    return(

        <View style={styles.tabbar}>

            <ImageButton imagePath={require('@/assets/images/mower-logo.png')} imageStyle={styles.tabs}/>
            <Button title='Logout' onPress={handleLogout}/>

        </View>

    );

}

const styles = StyleSheet.create({
    tabbar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: 'lightgrey',
        height: 80,
        width: '100%',
    },
    tabs: { 
        width: 30,
        height: 30,
        margin: 20,
    }
});