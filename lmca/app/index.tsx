import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; 
import Body from '@/components/Body';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Access environment variables
  const { extra } : any = Constants.expoConfig;
  const myapiURL = extra?.apiURL;

  const handleSubmit = () => {
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Please enter both username and password.');
      setLoading(false);
      return;
    }

    fetch(`${myapiURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => response.json())
      .then(async data => {
        setLoading(false);
        if (data.error) {
          setError(data.error); 
        } else {
          // Handle successful login
          await AsyncStorage.setItem('id', data.user._id);
          await AsyncStorage.setItem('username', data.user.username);
          router.push('/home');
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
        setError('An unexpected error occurred.');
      });
  }

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

          <TextInput 
            style={styles.textInput} 
            value={username} 
            placeholder='Username' 
            onChangeText={setUsername}
          />
          <TextInput 
            style={styles.textInput} 
            value={password} 
            placeholder='Password' 
            secureTextEntry
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.loginButton}>
            <Button title="Login" onPress={handleSubmit} disabled={loading} color='white'/>
          </TouchableOpacity>
          {loading && <ActivityIndicator size="small" color="#0000ff" />}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.transferRow}>
            <Text>New User? </Text>
            <Button title="Signup" onPress={() => router.push('/signup')} />
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
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: 'blue',
    borderColor: 'darkblue',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    width: 100,
  },
});
