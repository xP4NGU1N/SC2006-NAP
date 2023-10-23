import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, {Marker, Circle } from 'react-native-maps';
import axios from 'axios';
import proj4 from 'proj4';
import data from '../../assets/hdb_carpark.json';
import { useNavigation } from "@react-navigation/native";

const { BASE_URL } = require('../../server/config.js')
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
const markers = [];

const Home = () => {
  
  const [position, setPosition] = useState({
    latitude: 10,
    longitude: 10,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

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

        const govsgresponse = await axios.get(govsgurl ,{
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

  return (
    
    <View style={styles.container}>
      {carparkData.length > 0 ? (
        <MapView style={styles.map} region={region}>
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
            <Marker
              title='You are here'
              description='This is a description'
              coordinate={position}/>
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
});

export default Home;