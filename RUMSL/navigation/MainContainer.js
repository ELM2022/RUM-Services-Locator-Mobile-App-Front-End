import * as React from 'react';
import { StyleSheet,Dimensions,TouchableOpacity, View} from 'react-native';
import { NavigationContainer, DefaultTheme, useNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getAllOffices} from '../handler/directoryHandler';
//import 'react-native-gesture-handler'

//Screens

import HomeScreen from './screens/GoogleMapHomeClass';
import DirectoryScreen from './screens/DirectoryScreen';
import SearchScreen from './screens/SearchViewWithResults';


//Screens names
const homeName = 'Inicio';
const directoryName = 'Directorio';
const searchName = 'Búsqueda';

const MyTheme = {
 
    colors: {
      ...DefaultTheme.colors,
      card: 'green',
    },
  };
const Tab = createBottomTabNavigator();
const CustomTabBarButton = ({children, onPress}) => (
    <TouchableOpacity
    style={{
        top: -25,
        justifyContent: 'center',
        alignItems: 'center',
    }}
    onPress={onPress}
    >
        <View style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: 'green'
        }}>
            {children}
        </View>
    </TouchableOpacity>
);

export default function MainContainer(){
    const navigationRef = useNavigationContainerRef();
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
                elevation: 0, // remove shadow on Android
                shadowOpacity: 0, // remove shadow on iOS
                borderBottomWidth: 0, 
                tabBarLabelStyle:{
                    fontSize:15,
                    
               },

            })}
            >
                <Tab.Screen name={directoryName} component={DirectoryScreen}
                options = {{
                    headerStyle: { backgroundColor: 'white' }
                }}
                onPress={() => Alert.alert("Direcotry Screen Clicked!")}
                />
                <Tab.Screen name={homeName} component={HomeScreen}
                options = {{
                    tabBarButton: (props) => (<CustomTabBarButton {...props}/>),
                    headerShown: false
                }}
                />
                <Tab.Screen name={searchName} component={SearchScreen}
                options = {{
                    headerStyle: { backgroundColor: 'white' }
                }}
                />
           
            </Tab.Navigator>
           
        </NavigationContainer>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#206227',
      },
  });
