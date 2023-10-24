import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import MapView, {Marker, Circle } from 'react-native-maps';
import axios from 'axios';
import proj4 from 'proj4';
import data from '../../assets/hdb_carpark.json';
import { useNavigation } from "@react-navigation/native";
import imageicon from '../../assets/adaptive-icon.png'

//import Geolocation from '@react-native-community/geolocation';

proj4.defs([
  [
    'SVY21',
    "+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +a=6378137 +rf=298.257223563 +units=m +no_defs"],
  [
    'WGS84',
    "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"
  ]
]);

const URA_API_URL = 'https://www.ura.gov.sg/uraDataService/insertNewToken.action';
const govsgurl = 'https://api.data.gov.sg/v1/transport/carpark-availability';
const accessKey = '098ecd87-27d6-414e-adc6-e8e7f3e65207'; // Use the provided access key
const { BASE_URL } = require('../../server/config.js')
const markers = [];
const Home = () => {
  


  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });
  const navigation = useNavigation();
  const [markers, setMarkers] = useState([]);
  const [carparkData, setCarparkData] = useState([]);
  const [carparkData2, setCarparkData2] = useState([]);
  const [region, setRegion] = useState({
    latitude: 1.3303110584045954, // Default latitude
    longitude: 103.85885005071715, // Default longitude
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const[draggableMarkerCoord, setDraggableMarkerCoord] = useState({
    longitude: 1.3303110584045954, 
    latitude: 103.85885005071715,
  });

  const handleMarkerDrag = (e) => {
    // Update the region based on the marker's new position
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setDraggableMarkerCoord(e.nativeEvent.coordinate);
    setRegion({ ...region, latitude, longitude });
  };

  
  useEffect(() => {


    const fetchCarparkData = async () => {
      try {
        const response = await axios.get(URA_API_URL, {
          headers: {
            service: 'Car_Park_Availability',
            AccessKey: accessKey,
          },
        });

        const token = response.data.Result;

        const availabilityApiUrl = `https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability`;

        const availabilityResponse = await axios.get(availabilityApiUrl, {
          headers: {
            AccessKey: accessKey,
            Token: token,
          },
        });

        const govsgresponse = await axios.get(govsgurl,{
          headers:{
            service: 'carpark_info'
          }
        })
        const govsgdata = govsgresponse.data.items[0].carpark_data;
        setCarparkData2(govsgdata);

        console.log(`${BASE_URL}/carpark/retrieve`)
        const testAPI = await axios.get(`${BASE_URL}/carpark/retrieve` , {
          headers: {}
        })
        
        console.log(testAPI)
        
  


        const carparkData = availabilityResponse.data.Result;
        //for(let i = 0;i<carparkData2.length;i++){
          //console.log(carparkData2[i], i,"/",carparkData2.length)
        //}
        setCarparkData(carparkData);
        
        // Find the coordinates of the first carpark and set the region
        if (carparkData.length > 0) {
          const firstCarpark = carparkData[0];
          const svy21Coordinates = firstCarpark.geometries[0].coordinates;
          const x = parseFloat(svy21Coordinates.split(',')[0]);
          const y = parseFloat(svy21Coordinates.split(',')[1]);
      
          const converted = proj4('SVY21', 'WGS84', [x,y]);

          const x1 = parseFloat(String(converted).split(',')[0]);
          const y1 = parseFloat(String(converted).split(',')[1]);
          
          


        }
      } catch (error) {
        console.error('Error fetching carpark data:', error);
      }
    };

    
    fetchCarparkData();
    

  }, []);

    

    
    for(i=0;i<carparkData2.length;i++){
      data.map(carpark => {
          if (carpark.car_park_no == carparkData2[i].carpark_number)
            {
              
              
              //console.log("matched",carpark.car_park_no,carpark.x_coor,carpark.y_coor,carparkData2[i].carpark_info[0].lots_available,"/",carparkData2[i].carpark_info[0].total_lots,carpark.x_coor,carpark.y_coor,j)
              if (markers.findIndex(marker => marker.key === carpark.car_park_no) === -1) {
                const floatxcoor = parseFloat(carpark.x_coor)
                const floatycoor = parseFloat(carpark.y_coor)
                markers.push(
                <Marker
                  key={carpark.car_park_no}
                  coordinate={{
                    latitude : floatxcoor,
                    longitude : floatycoor,}}
                    title={carpark.car_park_no}
                    description={carparkData2[i].carpark_info[0].lots_available}
                />)
              } 
            }
        })
    }
  



  for (let i = 0; i < carparkData.length; i++) {
    
    const carpark = carparkData[i];
    for (let j = 0; j < carpark.geometries.length; j++) {
      const geometry = carpark.geometries[j];
      const number = String(carpark.carparkNo)
      const x1 = parseFloat(geometry.coordinates.split(',')[0])
      const y1 = parseFloat(geometry.coordinates.split(',')[1])
      //console.log(number);

      const longitude = String(proj4('SVY21', 'WGS84', [x1,y1])).split(',')[0];
      const latitude = String(proj4('SVY21', 'WGS84', [x1,y1])).split(',')[1];

      const floatlong = parseFloat(longitude);
      const floatlat = parseFloat(latitude);
      if (markers.findIndex(marker => marker.key === carpark.carparkNo) === -1) {
  markers.push(
        <Marker
          key={carpark.carparkNo}
          coordinate={{
            latitude : floatlat,
            longitude : floatlong,}}
      
            title={carpark.carparkNo}
            description={carpark.lotsAvailable}
            
          

        />
      );
  
} 
      
    }
  }



  function searchAddressInJSON(address) {
    try {
      // Read the JSON data from the file.
      console.log(address);
  
      // Filter the data based on the "address" field.
      const filteredData = data.filter((carpark) =>
        carpark.address.toLowerCase().includes(address.toLowerCase()) ||
        carpark.car_park_no.toLowerCase().includes(address.toLowerCase())

      );
  
      // Extract "x_coord" and "y_coord" values from the filtered data.
      const coords = filteredData.map((carpark) => ({
        x_coor: carpark.x_coor,
        y_coor: carpark.y_coor,
        car_park_no: carpark.car_park_no
      }));
  
      console.log(filteredData);

      return coords;
    } catch (error) {
      console.error('Error reading or parsing the JSON file:', error);
      return [];
    }
  }

  const [searchText, setSearchText] = useState('');
  const [searchMarker, setSearchMarker] = useState({
    latitude: 1.3303110584045954, // Default latitude
    longitude: 103.85885005071715, // Default longitude
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const [searchMarkerColor, setSearchMarkerColor] = useState('#0000ff');

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    // You can perform your search logic here based on the text input
    // Update markers or region accordingly
  };



  const handleSearchButtonPress = () => {
    const coordinates = searchAddressInJSON(searchText);

    // You can now use the coordinates array to update your map view or perform any other actions as needed.
    // For example, if you want to center the map on the first result, you can do something like this:
  
    if (coordinates.length > 0) {
      const firstCoordinate = coordinates[0];
      console.log(firstCoordinate.y_coor,firstCoordinate.x_coor)
      const newRegion = {
        latitude: firstCoordinate.x_coor,
        longitude: firstCoordinate.y_coor,
        latitudeDelta: 0.1, // Adjust these values as needed
        longitudeDelta: 0.1,
      };
      
      console.log(firstCoordinate.car_park_no)
      const markerIndex = markers.findIndex(marker => marker.key === String(firstCoordinate.car_park_no));
      console.log(markerIndex)

      if (markerIndex !== -1) {
        console.log("changing color")
        // Update the color of the found marker to green
        setSearchMarkerColor('#0F0F0F')
        console.log(newRegion)
        setSearchMarker(newRegion)
        
      }

    }

  };
  return (
    
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a location..."
        value={searchText}
        onChangeText={handleSearchTextChange}
      />
      <Button
          title="Search"
          onPress={handleSearchButtonPress}
          
        />

      {carparkData.length > 0 ? (
        <MapView style={styles.map} region={region}>
          <Marker
            //image={imageicon}
            pinColor= {searchMarkerColor}
            coordinate={searchMarker}
            

          ></Marker>
          <Marker
            draggable
            pinColor='#0000ff'
            coordinate={region}
            onDragEnd={handleMarkerDrag}

          ></Marker>
          <Circle
            center = {draggableMarkerCoord}
            radius = {1000}
          />
          {markers}
            
        </MapView>
      ) : (
        <Text>Loading carpark data...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchBar: {
    width: '100%', // Adjust the width to your preference (e.g., 80% of the screen width)
    height: 60,
    borderWidth: 1,
    borderColor: 'gray',
    paddingLeft: 10,
    paddingTop: 10,
  }
});

export default Home;