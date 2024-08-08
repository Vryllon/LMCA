import React from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router'; 
import Body from '@/components/Body';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <Body content={

      <>
        <View style={styles.titleRow}>

          <Text style={styles.title}>Lawn</Text>
          <Image source={require('@/assets/images/mower-logo.png')} style={styles.titleImage}/>
          <Text style={styles.title}>Buddy</Text>

        </View>

        <View style={styles.container}>

          <Text style={styles.title}>Login</Text>

          <TextInput style={styles.textInput} value="Username"/>

          <TextInput style={styles.textInput} value="Password"/>

          <View style={styles.transferRow}>

            <Text>New User? </Text>

            <Button
              title="Signup"
              onPress={() => router.push('/signup')}
            />

          </View>

        </View>
      </>
    }/>
  );
}

const styles = StyleSheet.create({
container: {
  alignItems: 'center',
  padding: 40,
  backgroundColor: 'lavender',
  borderRadius: 20,
},
title: {
  fontSize: 32,
  marginVertical: 20,
},
titleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 50,
},
titleImage: {
  width: 50,
  height: 50,
  marginHorizontal: 10,
},
textInput: {
  width: 200,
  height: 50,
  borderWidth: 1,
  padding: 5,
  marginVertical: 20,
},
transferRow: {
  flexDirection: 'row',
  alignItems: 'center',
}
});
