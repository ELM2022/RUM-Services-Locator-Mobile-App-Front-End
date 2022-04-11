import * as React from 'react';
import{View,Text,ImageBackground,StyleSheet, } from 'react-native';
import MyWeb from './WebVisualizer';



export default function HomeScreen({navitagtion}){
    return(
          <MyWeb/>
    );
}

const styles = StyleSheet.create({
    background:{
        flex: 1,
    }
});
