import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Body from '@/components/Body';
import Tabbar from '@/components/Tabbar';
import Constants from 'expo-constants';
import OptionsField from '@/components/OptionsField';
import { router } from 'expo-router';
import GDDResults from '@/components/GDDResults';

const HomeScreen = () => {

  const [username, setUsername] = useState('');
  const [avgTemperature, setAvgTemperature] = useState([]);
  const [baseTemperature, setBaseTemperature] = useState(0);
  const [zipCode, setZipCode] = useState('12345');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateRange, setDateRange] = useState([]);

  // Access environment variables
  const { extra } : any = Constants.expoConfig;
  const usernameW = extra?.meteomaticsUsername;
  const passwordW = extra?.meteomaticsPassword;
  const key = extra?.vcKey;
  const myapiURL = extra?.apiURL;

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
  const fetchWeatherData = async () => {
    
    try {

      // Request Average temp value  
      const responseH = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${zipCode}/${startDate}/${endDate}?key=${key}&include=days&elements=datetime,temp`,
      {});

      if (!responseH.ok) throw new Error('Failed to fetch temperature data');
     
      const data = await responseH.json();
      console.log('Average Temp Data:', data);

      const temperatures = data.days.map((day: { temp: any; }) => day.temp);
      const dateRange = data.days.map((day: { datetime: any; }) => day.datetime);

      // You now have an array of temperatures, so we just keep it as it is
      console.log('List of Average Temperatures:', temperatures);
      setAvgTemperature(temperatures);
      console.log('List of Dates:', dateRange);
      setDateRange(dateRange);
  
    } catch (error) {
        console.error('Error fetching weather data:', error);
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
    <>
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

            <Text>Enter Date Range Below (yyyy-mm-dd)</Text>
            <View style={styles.dateInputsFormat}>
              <TextInput 
                style={styles.textInput} 
                value={startDate} 
                placeholder="yyyy-mm-dd"
                defaultValue=""
                onChangeText={setStartDate}
              />
                <TextInput 
                style={styles.textInput} 
                value={endDate} 
                placeholder="yyyy-mm-dd" 
                defaultValue="" 
                onChangeText={setEndDate}
              />
            </View>

            <Text>Choose Base Temp Value:</Text>
            <OptionsField 
              defaultValue='10C' 
              options={BaseTempOptions} 
              onChange={(value) => setBaseTemperature(value)} 
            />

            <View
              style={styles.submitButton}>
              <Button title='Calculate GDD' color={'black'} onPress={fetchWeatherData}/>
            </View>

            <GDDResults avgTemperatures={avgTemperature} dateRange={dateRange} base={baseTemperature}/>

          </View>

        </>

      }/>

      <Tabbar/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width : "100%"
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  textInput: {
    width: "40%",
    height: 50,
    borderWidth: 1,
    padding: 5,
    marginVertical: 20,
    marginHorizontal: "5%"
  },
  submitButton: {
    height: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    backgroundColor: 'lime'
  },
  dateInputsFormat: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  }
});

export default HomeScreen;
