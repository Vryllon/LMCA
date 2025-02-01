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
  const [avgTemperature, setAvgTemperature] = useState(0);
  const [baseTemperature, setBaseTemperature] = useState(0);
  const [zipCode, setZipCode] = useState('12345');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [coords, setCoords] = useState('');

  // Access environment variables
  const { extra } : any = Constants.expoConfig;
  const usernameW = extra?.meteomaticsUsername;
  const passwordW = extra?.meteomaticsPassword;
  const key = extra?.geocodingKey;
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
  const fetchWeatherData = async ({ location } : any) => {
    
    if (!usernameW || !passwordW) {
      throw new Error('Meteomatics username and password must be set in environment variables.');
    }
    
    // Create a Basic Auth header
    const authHeader = 'Basic ' + btoa(usernameW + ':' + passwordW);
  
    try {
        // Request High temp value  
        const responseH = await fetch(`https://api.meteomatics.com/now/t_max_2m_24h:C/${location}/json?model=mix`, {
            headers: {
                'Authorization': authHeader
            }
        });
        if (!responseH.ok) throw new Error('Failed to fetch high temperature data');
        
        const dataH = await responseH.json();
        console.log('High Temp Data:', dataH);
  
        // Extract high temperature from the API response
        const highTemperature = dataH.data[0].coordinates[0].dates[0].value;;
  
        // Request Low temp value  
        const responseL = await fetch(`https://api.meteomatics.com/now/t_min_2m_24h:C/${location}/json?model=mix`, {
            headers: {
                'Authorization': authHeader
            }
        });
        if (!responseL.ok) throw new Error('Failed to fetch low temperature data');
        
        const dataL = await responseL.json();
        console.log('Low Temp Data:', dataL);
  
        // Extract low temperature from the API response
        // Extract low temperatures into an array
    const lowTemperature = dataL.data[0].coordinates[0].dates[0].value;

    var averageTemperature = (highTemperature + lowTemperature) / 2.0;

  
        return { averageTemperature };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return { averageTemperature : 0 };
    }
  };

  const zipToCoord = async () => {
    try {
      // Check if coordinates are already stored in the database
      const response = await fetch(`${myapiURL}/zipcodes/coords/${zipCode}`);
      const data = await response.json();
  
      if (data && data.coords) {
        console.log("Found coords in DB: " + data.coords);
        return data.coords; // Return coordinates found in the database
      }
  
      // If not found in the database, fetch coordinates from the external API
      console.log("No saved zip->coord found. Fetching from API...");
      const apiResponse = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${zipCode},+USA&key=${key}`);
      if (!apiResponse.ok) throw new Error('Failed to fetch coordinate data');
  
      const apiData = await apiResponse.json();
      const results = apiData.results;
  
      if (results.length > 0) {
        const geometry = results[0].geometry;
        const newCoords = `${geometry.lat},${geometry.lng}`;
        console.log("Fetched coords from API: " + newCoords);
  
        // Save the new coordinates to the database
        await saveZipToCoord(newCoords);
        return newCoords; // Return new coordinates
      } else {
        throw new Error('No results found from API');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw error;
    }
  };
  
  const getWeatherData = async () => {
    try {
      const coords = await zipToCoord(); // Get coordinates from zipToCoord
      console.log('coords : ' + coords + ' date range : ' + startDate + ' - ' + endDate);
      setCoords(coords);
  
      fetchWeatherData({
        location: coords,
        startDate: endDate,
        endDate: startDate
      }).then(({ averageTemperature }) => {
        console.log('AVG Temp: ', averageTemperature);
        setAvgTemperature(averageTemperature);
      });
    } catch (error) {
      console.error('Error getting weather data:', error);
    }
  };  
  
  

  const saveZipToCoord = async (coords: string) => {
    try {
      console.log("Save zip to coord called");
      const zip = zipCode;
  
      // Save zipcode->coordinates conversion to the database
      const response = await fetch(`${myapiURL}/zipcodes/coords`, {
        method: 'POST', // Ensure you use POST to create new entries
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ zip, coords })
      });
  
      if (!response.ok) throw new Error('Failed to save zip->coord data');
      console.log("Successfully saved zip->coord data.");
    } catch (error) {
      console.error('Error saving zip->coords:', error);
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

            <Text>Enter Date Range Below (yyyy/mm/dd)</Text>
            <View style={styles.dateInputsFormat}>
              <TextInput 
                style={styles.textInput} 
                value={startDate} 
                placeholder="yyyy/mm/dd"
                defaultValue=""
                onChangeText={setStartDate}
              />
                <TextInput 
                style={styles.textInput} 
                value={endDate} 
                placeholder="yyyy/mm/dd" 
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
              <Button title='Calculate GDD' color={'black'} onPress={getWeatherData}/>
            </View>

            <GDDResults avgTemperature={avgTemperature} base={baseTemperature}/>

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
