//import * as React from 'react';
import React, { Component, useEffect, useState } from 'react'
import {  Searchbar } from 'react-native-paper';
import { View ,Text,Button,Alert,Keyboard, StyleSheet,Pressable,TouchableOpacity,ScrollView,SafeAreaView, ActivityIndicator} from 'react-native';
import { getAutoComplete,getServices,getAllOffices} from '../../handler/directoryHandler';
//import 'react-native-gesture-handler'

const MyComponent = ({navigation}) => {
      
    var autoCompleteArr = []
    const [servicesArr , setServicesArr] = React.useState([]);
    const [inputedKeyword , setInputedKeyword] = React.useState('');

  function testAzureSearch(inputKeyword) {
    setInputedKeyword(inputKeyword);
      setServicesArr([]);
      getAutoComplete(inputKeyword).then(res => {

      autoCompleteArr = res.data.value;
      if(res.data.value[0] === {} || res.data.value[0] === null || res.data.value[0] === undefined){
       Alert.alert('No se encontró ningún servicio relacionado a esa palabra. Por favor intente de nuevo.');
      }
    autoCompleteArr.forEach(element => {
   
           getServices(element.text).then(res => {
            setServicesArr(res.data.value);

            servicesArr.map((objects, index) => {
                const { office_id, office_name } = objects //destructuring
          })
         })
    });
 })
  renderTableData()
};

function reRenderAzureSearch() {
  setServicesArr([]);
  getAutoComplete(inputedKeyword).then(res => {

  autoCompleteArr = res.data.value;
  if(res.data.value[0] === {} || res.data.value[0] === null || res.data.value[0] === undefined){
   Alert.alert('No se encontró ningún servicio relacionado a esa palabra. Por favor intente de nuevo.');
  }
autoCompleteArr.forEach(element => {

       getServices(element.text).then(res => {
        setServicesArr(res.data.value);

        servicesArr.map((objects, index) => {
            const { office_id, office_name } = objects //destructuring
      })
     })
});
})
renderTableData()
};



function renderTableData(){
  return servicesArr.map((office, index) => {
     const { office_id, office_name } = office //destructuring
     return (
        <View key={office_id} >
        <TouchableOpacity
        style={styles.button2}
        onPress={() => {
          navigation.navigate('Inicio', office)
          reRenderAzureSearch()
        }}
        >
        <Text style={styles.text2}>{office_name}</Text>
      </TouchableOpacity>
      </View>
      
     )
  }) 
}
          
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);
  return (
      <View >
    <View >
    <Searchbar
      placeholder="Ingrese servicio deseado..."
      onChangeText={onChangeSearch}
      value={searchQuery}
    />
    
    <Text style={styles.baseText}>
      {'\n'}
      {'     '}
      Ejemplo: Comida, Cafetería, etc...
    </Text>
    <Pressable style={styles.button}
      onPress={() => {
        
        testAzureSearch(searchQuery)
        Keyboard.dismiss()
     }
    } 
    >
      <Text style={styles.text}>Buscar</Text>
    </Pressable>
    
     <View style={styles.viewStyle}>
     <ScrollView style={styles.scrollView}>
     {renderTableData()}
  </ScrollView>
  </View>
  </View >
  </View >
  

  );
};


export default MyComponent;

const styles = StyleSheet.create({
  baseText: {
    fontSize: 20
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    padding : 6,
    margin : 50,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#4594F7',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  buttonDirectory: {
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    padding: 20
  },
  scrollView: {
    flex: 1,
    paddingBottom:400,
    backgroundColor: '#fff',
  },
  button2: {
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    padding: 20
  },
  text2:{
    fontSize: 26,
    color: '#029B36',
},
viewStyle:{
    backgroundColor: "#FFFFFF",
    
},
container: {
  flex: 1,
  justifyContent: "center"
},
horizontal: {
  flexDirection: "row",
  justifyContent: "space-around",
  padding: 10
}
  
});

