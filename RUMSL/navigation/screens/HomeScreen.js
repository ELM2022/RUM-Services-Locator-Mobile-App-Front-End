import * as React from 'react';
import{View,Text,ImageBackground,StyleSheet, } from 'react-native';
import MyWeb from './WebVisualizer'; //<MyWeb/>
import MapView from 'react-native-maps';


export default function HomeScreen({navitagtion}){
    return(
        <View style={styles.container}>
        {/*Render our MapView*/}
          <MapView
            style={styles.map}
            //specify our coordinates.
            initialRegion={{
              latitude: 18.2109,
              longitude: -67.1407,
              latitudeDelta: 0.000922,
              longitudeDelta: 0.00421,
            }}
          />
        </View>
    );
}

const styles = StyleSheet.create({
    background:{
        flex: 1,
    },
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1, //the container will fill the whole screen.
        justifyContent: "flex-end",
        alignItems: "center",
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      },
});
