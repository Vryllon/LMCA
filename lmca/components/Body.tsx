import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Body({ content } : any) {
    return (
        <View
            style={styles.container}
        >

            {content}
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
