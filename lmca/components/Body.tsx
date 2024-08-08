import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Body({ content } : any) {
    return (
        <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollView}
        >

            {content}
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1, // Ensures the ScrollView content container grows to fill the available space
        justifyContent: 'center',
        alignItems: 'center',
    },
});
