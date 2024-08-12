import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Body from '@/components/Body';
import Tabbar from '@/components/Tabbar';
import Constants from 'expo-constants';
import OptionsField from '@/components/OptionsField';
import { router } from 'expo-router';

const HomeScreen = () => {

  const [username, setUsername] = useState('');
  const [highTemperature, setHighTemperature] = useState(null);
  const [lowTemperature, setLowTemperature] = useState(null);
  const [zipCode, setZipCode] = useState('12345');
  const [startDate, setStartDate] = useState('2024-07-10');
  const [endDate, setEndDate] = useState('2024-08-10');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

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
        const responseH = await fetch(`https://api.meteomatics.com/${startDate}T12:00:00Z--${endDate}T12:00:00Z/t_max_2m_24h:C/${location}/json?model=mix`, {
            headers: {
                'Authorization': authHeader
            }
        });
        if (!responseH.ok) throw new Error('Failed to fetch high temperature data');
        
        const dataH = await responseH.json();
        console.log('High Temp Data:', dataH);
  
        // Extract high temperature from the API response
        const highTemperature = dataH.data?.[0]?.coordinates?.[0]?.dates?.map((date: { value: any; }) => date.value) ?? [];
  
        // Request Low temp value  
        const responseL = await fetch(`https://api.meteomatics.com/${startDate}T00:00:00Z--${endDate}T24:00:00Z/t_min_2m_24h:C/${location}/json?model=mix`, {
            headers: {
                'Authorization': authHeader
            }
        });
        if (!responseL.ok) throw new Error('Failed to fetch low temperature data');
        
        const dataL = await responseL.json();
        console.log('Low Temp Data:', dataL);
  
        // Extract low temperature from the API response
        // Extract low temperatures into an array
    const lowTemperature = dataL.data?.[0]?.coordinates?.[0]?.dates?.map((date: { value: any; }) => date.value) ?? [];
  
        return { highTemperature, lowTemperature };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return { highTemperature: null, lowTemperature: null };
    }
  };

  const getWeatherData = async () => {

    fetchWeatherData({
      location : '28.5663,-81.2608', 
      startDate : '2024-08-12', 
      endDate : '2024-08-12'
    }).then(({ highTemperature, lowTemperature }) => {
      console.log('High Temp:', highTemperature);
      console.log('Low Temp:', lowTemperature);
      setHighTemperature(highTemperature);
      setLowTemperature(lowTemperature);
      router.push('/gddResults');
    });

  }

  const zipToCoord = async () => {
    try{

      // Access environmental variable
      const { extra } : any = Constants.expoConfig;
      const key = extra?.geocodingKey;

      // Request coords from zip
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${zipCode},+USA&key=${key}`);
      if (!response.ok) throw new Error('Failed to fetch coordinate data');

      // Extract high temperature from the API response
      const data = await response.json();
      const results = data.results;

      if (results.length > 0) {
        const geometry = results[0].geometry;
        setLat(geometry.lat)
        setLng(geometry.lng)
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw error;
    }
  };

  // Set up options for option fields
  const BaseTempOptions = [
    { id: '1', title: '10C' },
    { id: '2', title: '0C' },
    { id: '3', title: '50F' },
    { id: '4', title: '32F' },
  ];
  

  return (
    <Body content={
      
      <>

        <View style={styles.container}>

          <Text style={styles.welcomeText}>Welcome, {username || 'Guest'}!</Text>

          <Text>Enter Zip Code:</Text>
          <TextInput 
            style={styles.textInput} 
            value={zipCode} 
            placeholder='12345' 
            defaultValue={zipCode} 
            onChangeText={setZipCode}
          />

          <Text>Enter Date Range (year-month-day):</Text>
          <View style={styles.inputDatesRow}>
            <TextInput 
              style={styles.inputDates} 
              value={startDate} 
              placeholder='2024-07-10' 
              defaultValue={startDate}
              onChangeText={setStartDate}
            />
            <TextInput 
            style={styles.inputDates} 
            value={endDate} 
            placeholder='2024-08-10' 
            defaultValue={endDate} 
            onChangeText={setEndDate}
            />
          </View>

          <Text>Choose Base Temp Value:</Text>
          <OptionsField defaultValue='10C' options={BaseTempOptions}/>

          <Button title='Get Coordinates' onPress={zipToCoord}/>
          <Text>Latitude : {lat || 'N/A'}</Text>
          <Text>Longitude : {lng || 'N/A'}</Text>

          <Button title='Get Data' onPress={getWeatherData}/>

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
    margin: 20,
  },
  textInput: {
    width: 200,
    height: 50,
    borderWidth: 1,
    padding: 5,
    marginVertical: 20,
  },
  inputDatesRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  inputDates: {
    width: 100,
    height: 50,
    borderWidth: 1,
    padding: 5,
    margin: 20,
  }
});

export default HomeScreen;
