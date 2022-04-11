import * as React from 'react';
import { StyleSheet,Dimensions} from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

//Screens
import HomeScreen from './screens/HomeScreen';
import DirectoryScreen from './screens/DirectoryScreen';
import SearchScreen from './screens/SearchScreen';


//Screens names
const homeName = 'Inicio';
const directoryName = 'Directorio';
const searchName = 'Busqueda';

const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'green',
      background: 'white',
      card: 'green',
    },
  };
const Tab = createBottomTabNavigator();

export default function MainContainer(){
    console.log(Dimensions.get("screen"));
    return(
        <NavigationContainer theme={MyTheme}>
            
            <Tab.Navigator
            
            initialRouteName={homeName}
            screenOptions={
                
                ({route})=>({
                tabBarIcon:({focused,color,size})=>{
                    let iconName;
                    let routeName = route.name;

                    if(routeName === homeName){
                        iconName = focused ? 'home' : 'home-outline';
                    } 
                    else if(routeName === directoryName){
                        iconName = focused ? 'menu' : 'menu-outline';
                    }
                    else if(routeName === searchName){
                        iconName = focused ? 'search' : 'search-outline';
                    }
                    return <Ionicons name={iconName} size = {size} color={color}/>
                }, 
                tabBarActiveTintColor:'black',
                tabBarInactiveTintColor:'white',
                tabBarActiveBackgroundColor:'green',
                tabBarInactiveBackgroundColor:'green',
                position:'absolute',
                elevation: 0, // remove shadow on Android
                shadowOpacity: 0, // remove shadow on iOS
                borderBottomWidth: 0, // Just in case.
                
                tabBarLabelStyle:{
                    fontSize:15,
                    
               },

            })}
           
            
            >
               
                <Tab.Screen name={directoryName} component={DirectoryScreen}/>
                <Tab.Screen name={homeName} component={HomeScreen}/>
                <Tab.Screen name={searchName} component={SearchScreen}/>
           
            </Tab.Navigator>
           
        </NavigationContainer>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#206227',
      },
  });
