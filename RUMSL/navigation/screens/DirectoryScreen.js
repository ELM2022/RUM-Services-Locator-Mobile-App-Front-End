import React, { Component, useState } from 'react'
//import * as React from 'react';
import { StyleSheet,ScrollView,TouchableOpacity,Text,Alert,View} from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { useIsFocused } from '@react-navigation/native';
//import 'react-native-gesture-handler'
import {getAllOffices, getAutoComplete, getAllOfficesByCategories} from '../../handler/directoryHandler';


class Table extends Component {
   constructor(props) {
      super(props) //override Component class constructor
      this.state = { //state is by default an object
         Offices: [],
         Categories: [],
         reRender: false
      }
   }


componentDidMount(){
   getAllOffices().then(res => {
      this.setState({...this.state, Offices:res.data.data.offices})
   })
   getAllOfficesByCategories().then((res) => {
     this.setState({...this.state, Categories:res.data})
   })
}

 renderTableData() {
   return this.state.Offices.map((office, index) => {
      const { office_id, office_name } = office //destructuring
      return (
         <View key={office_id}>
         <TouchableOpacity
         style={styles.button}
         onPress={() => {
          this.props.navigation.navigate('Inicio', office)
          this.componentDidMount();
         }
      }
         >
         <Text style={styles.text}>{office_name}</Text>
       </TouchableOpacity>
       </View>
      )
   })
}

renderAllDropdowns(){
  return (this.state.Categories.map((category, index) => {
    const {category_name, offices} = category;
      return(
        <Dropdown
         key={index}
         style={styles.button}
         data={offices}
         maxHeight={170}
         labelField="office_name"
         valueField="office_name"
         placeholder={category_name}
         placeholderStyle={styles.text}
         selectedTextStyle={styles.text}
         onChange={item => {
           console.log(item)
           this.props.navigation.navigate('Inicio', item)
           this.componentDidMount();
         }}
        >
         <Text style={styles.text}>{offices.office_name}</Text>
       </Dropdown>
      )
    })
    )
}
    render() {
        return (
           <View style={styles.scrollView}>
             <ScrollView  id='students'> 
                      {this.renderAllDropdowns()} 
                      <View ><Text style = {styles.directoryDivisions}>Servicios</Text></View>
                      {this.renderTableData()}  
             </ScrollView>
          </View>
        )
    }
    
}

export default Table 

const styles = StyleSheet.create({
    button: {
      alignItems: "flex-start",
      backgroundColor: "#FFFFFF",
      padding: 20
    },
    text:{
        fontSize: 20,
        color: '#029B36',
    },
    directoryDivisions:{
      fontSize: 18,
      color: '#000',
      padding: 10,
      textAlign: 'center',
      backgroundColor: '#f2f2f2',
  },
    placeholderStyle: {
      fontSize: 26,
    },
    selectedTextStyle: {
      fontSize: 26,
    },
    scrollView: {
      paddingBottom:40,
      backgroundColor: '#fff',
    },
  });