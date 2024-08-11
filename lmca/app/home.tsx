import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Body from '@/components/Body';
import Tabbar from '@/components/Tabbar';
import Constants from 'expo-constants';

const HomeScreen = () => {

  const [username, setUsername] = useState('');
  const [highTemperature, setHighTemperature] = useState(null);
  const [lowTemperature, setLowTemperature] = useState(null);

  // Fetch the username from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername !== null) {
          console.log('Username:', storedUsername);
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Failed to fetch username:', error);
      }
    };

    fetchUsername();
  }, []); // Empty dependency array ensures this runs once when component mounts

  // Fetch HiLo temp data from meteomatic api
  const fetchWeatherData = async ({ location, startDate, endDate } : any) => {
    // Access environment variables
    const { extra } : any = Constants.expoConfig;
    const username = extra?.meteomaticsUsername;
    const password = extra?.meteomaticsPassword;
    
    if (!username || !password) {
      throw new Error('Meteomatics username and password must be set in environment variables.');
    }
    
    // Create a Basic Auth header
    const authHeader = 'Basic ' + btoa(username + ':' + password);
  
    try {
        // Request High temp value  
        const responseH = await fetch(`https://api.meteomatics.com/${startDate}12:00:00Z--${endDate}12:00:00Z/t_max_2m_24h:C/${location}/json?model=mix`, {
            headers: {
                'Authorization': authHeader
            }
        });
        if (!responseH.ok) throw new Error('Failed to fetch high temperature data');
        
        const dataH = await responseH.json();
        console.log('High Temp Data:', dataH);
  
        // Extract high temperature from the API response
        const highTemperature = dataH.data?.[0]?.coordinates?.[0]?.dates?.[0]?.value ?? null;
  
        // Request Low temp value  
        const responseL = await fetch(`https://api.meteomatics.com/${startDate}12:00:00Z--${endDate}12:00:00Z/t_min_2m_24h:C/${location}/json?model=mix`, {
            headers: {
                'Authorization': authHeader
            }
        });
        if (!responseL.ok) throw new Error('Failed to fetch low temperature data');
        
        const dataL = await responseL.json();
        console.log('Low Temp Data:', dataL);
  
        // Extract low temperature from the API response
        const lowTemperature = dataL.data?.[0]?.coordinates?.[0]?.dates?.[0]?.value ?? null;
  
        return { highTemperature, lowTemperature };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return { highTemperature: null, lowTemperature: null };
    }
  };

  const getWeatherData = async () => {

    fetchWeatherData({
      location : '28.5663,-81.2608', 
      startDate : '2024-08-10T', 
      endDate : '2024-08-10T'
    }).then(({ highTemperature, lowTemperature }) => {
      console.log('High Temp:', highTemperature);
      console.log('Low Temp:', lowTemperature);
      setHighTemperature(highTemperature);
      setLowTemperature(lowTemperature);
    });

  }

  return (
    <Body content={
      
      <>

        <View style={styles.container}>

          <Text style={styles.welcomeText}>Welcome, {username || 'Guest'}!</Text>

          <Button title='Get Data' onPress={getWeatherData}/>

          <Text>High : {highTemperature || 'N/A'}</Text>
          <Text>Low : {lowTemperature || 'N/A'}</Text>

        </View>

        <Tabbar/>

      </>

    }/>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
