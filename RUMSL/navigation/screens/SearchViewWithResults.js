//import * as React from 'react';
import React, { Component, useState } from 'react'
import {  Searchbar } from 'react-native-paper';
import { View ,Text,Button,Alert,Keyboard, StyleSheet,Pressable,TouchableOpacity,ScrollView,SafeAreaView} from 'react-native';
import { getAutoComplete,getServices,getAllOffices} from '../../handler/directoryHandler';


const MyComponent = () => {
      
    var autoCompleteArr = []
    const [servicesArr , setServicesArr] = React.useState([]);
    //const onChangeArr = query => setServicesArr(query);

  function testAzureSearch(inputKeyword) {
      setServicesArr([]);
  getAutoComplete(inputKeyword).then(res => {
    //console.log(res.data.value[0].text) 
    autoCompleteArr = res.data.value;
    autoCompleteArr.forEach(element => {
       //console.log(element.text)
         ///
           getServices(element.text).then(res => {
            //servicesArr = res.data.value;
            setServicesArr(res.data.value);
            servicesArr.map((objects, index) => {
                const { office_id, office_name } = objects //destructuring
                console.log(office_name)
          })
         })
    });
 })
 renderTableData()

};

function componentDidMount(){
  
    getAllOffices().then(res => {
       //console.log(res.data.data.offices) 
       //var Offices = res.data.data.offices
       servicesArr = res.data.data.offices
       servicesArr.map((res, index) => {
          const { office_id, office_name } = res //destructuring
          console.log(office_id +":"+office_name)
    })
    })
   
 }

 

function renderTableData(){
   
  return servicesArr.map((office, index) => {
     const { office_id, office_name } = office //destructuring
     return (
        <View key={office_id} >
        <TouchableOpacity
        style={styles.button2}
        onPress={() => Alert.alert(office_name+" Button Clicked with id= "+office_id+" 🧚🏻 ")}
        >
        <Text style={styles.text2}>{office_name}</Text>
      </TouchableOpacity>
      </View>
     )
  })
}

function renderTable(){
  return (
     <View style={styles.scrollView}>
       <ScrollView  id='students'> 
                {renderTableData()}  
       </ScrollView>
    </View>
  )
}
function renderSearchTable(){
    return (
       <View style={styles.scrollView}>
         <ScrollView  id='students'> 
                  {renderTableData()}  
         </ScrollView>
      </View>
    )
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
    } // Value stored in search bar
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
  
});

