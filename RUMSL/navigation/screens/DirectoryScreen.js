import React, { Component, useState } from 'react'
//import * as React from 'react';
import { StyleSheet,ScrollView,TouchableOpacity,Text,Alert,View} from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { useIsFocused } from '@react-navigation/native';

import {getAllOffices, getAutoComplete} from '../../handler/directoryHandler';


//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//const Tab = createBottomTabNavigator();
 
// Drop Down Label and Data for Estudiante de Nuevo Ingreso
const serviceNuevoIngreso = [
   { label: 'Estudiante Nuevo Ingreso', value: 'A' },
 ];
const nuevoIngreso = [
   { label: 'Oficina de ID', value: '1.1' },
   { label: 'Librería', value: '1.2' },
   { label: 'Admisiones', value: '1.3' },
   { label: 'Asistencia Económica', value: '1.4' },
   { label: 'Servicios Médicos', value: '1.5' },
   { label: 'Tránsito y Vigilancia', value: '1.6' },
 ];
// Drop Down Label and Data for Seguridad
 const serviceSeguridad = [
   { label: 'Seguridad', value: 'B' },
 ];
 const seguridad = [
   { label: 'Guardia Universitaria', value: '2.1' },
   { label: 'Tránsito y Vigilancia', value: '2.2' },
 ];
 // Drop Down Label and Data for Salud
 const serviceSalud = [
   { label: 'Salud', value: 'C' },
 ];
 const salud = [
   { label: 'Servicios Médicos', value: '3.1' },
 ];
// Drop Down Label and Data for Consejeria
 const serviceConsejeria = [
   { label: 'Consejería', value: 'D' },
 ];
 const consejeria = [
   { label: 'Consejería Profesional', value: '4.1' },
   { label: 'Servicios Psicológicos', value: '4.2' },
   { label: 'Procuraduría', value: '4.3' },
 ];
 // Drop Down Label and Data for Asistencia Academica
 const serviceAsistenciaAcademica = [
   { label: 'Asistencia Academica', value: 'F' },
 ];
 const asistenciaAcademica = [
   { label: 'Admisiones', value: '5.1' },
   { label: 'RUMbo EX', value: '5.2' },
   { label: 'Oficina de Intercambio', value: '5.3' },
   { label: 'Centro de Redacción CIVIS', value: '5.4' },
   { label: 'Procuraduría', value: '5.5' },
 ];
 // Drop Down Label and Data for Asistencia Profesional
 const serviceAsistenciaProfesional = [
   { label: 'Asistencia Profesonal', value: 'G' },
 ];
 const asistenciaProfesional = [
   { label: 'Colocaciones', value: '6.1' },
   { label: 'Oficina Estudios Graduados', value: '6.2' },
 ];
 // Drop Down Label and Data for Matricula
 const serviceMatricula = [
   { label: 'Matrícula', value: 'H' },
 ];
 const matricula = [
   { label: 'Registraduría', value: '7.1' },
   { label: 'Recaudaciones', value: '7.2' },
 ];
 
class Table extends Component {
   constructor(props) {
      super(props) //override Component class constructor
      this.state = { //state is by default an object
         Offices: [ //Offices object to be replaced from Database call with proper Active Offices.
            // { id :'1', name: 'Cafetería ' },
            // { id :'2', name: 'Oficina de ID '},
            // { id :'3', name: 'Colocaciones '},
            // { id :'4', name: 'Actividades Sociales y Culturales '},
            // { id :'5', name: 'Consejería Profesional ' },
            // { id :'6', name: 'Servicios Psicológicos '},
            // { id :'7', name: 'Merendero '},
            // { id :'8', name: 'Librería '},
            // { id :'9', name: 'Oficina Intercambio ' },
            // { id :'10', name: 'Registraduría '},
            // { id :'11', name: 'Procuraduría '},
            // { id :'12', name: 'Estudios Graduados '},
            // { id :'13', name: 'Admisiones ' },
            // { id :'14', name: 'CIVIS '},
            // { id :'15', name: 'RUMbo Ex'},
            // { id :'16', name: 'Asisencia Económica '},
            // { id :'17', name: 'Servicios Médicos ' },
            // { id :'18', name: 'Tránsito y Vigilancia '},
            // { id :'19', name: 'Recaudaciones '},
            // { id :'20', name: 'Seguridad '},
         ],
      }
   }

    
   // testHomeScreenCall (){
   //    return (<Tab.Screen name={homeName} component={HomeScreen}
   //    options = {{
   //        tabBarButton: (props) => (<CustomTabBarButton {...props}/>),
   //        headerShown: false
   //    }}
   //    />)
   // }

   renderTableDropDownNuevoIngreso() {
    return serviceNuevoIngreso.map((service, index) => {
       const { label, value } = service //destructuring
       return (
          <Dropdown
          key={value}
          style={styles.button}
          data={nuevoIngreso}
          maxHeight={400}
          labelField="label"
          valueField="value"
          placeholder={label}
          placeholderStyle={styles.text}
          selectedTextStyle={styles.text}
          dropdownPosition = 'bottom'
          onChange={item => {
            Alert.alert(item.label+" Button Clicked with id= "+value+" 🧚🏻 ")
            console.log(item.label+" was clicked! ") //item.label contains clicke office
          }}
         >
          <Text style={styles.text}>{label}</Text>
        </Dropdown>
        
       )
    })
 }
 //Seguridad
 renderTableDropDownSeguridad() {
   return serviceSeguridad.map((service, index) => {
      const { label, value } = service //destructuring
      return (
         <Dropdown
         key={value}
         style={styles.button}
         data={seguridad}
         maxHeight={150}
         labelField="label"
         valueField="value"
         placeholder={label}
         placeholderStyle={styles.text}
         selectedTextStyle={styles.text}
         onChange={item => {
           Alert.alert(item.label+" Button Clicked with id= "+value+" 🧚🏻 ")
           console.log(item.label+" was clicked! ") //item.label contains clicke office
         }}
        >
         <Text style={styles.text}>{label}</Text>
       </Dropdown>
       
      )
   })
}
 //Salud
 renderTableDropDownSalud() {
   return serviceSalud.map((service, index) => {
      const { label, value } = service //destructuring
      return (
         <Dropdown
         key={value}
         style={styles.button}
         data={salud}
         maxHeight={80}
         labelField="label"
         valueField="value"
         placeholder={label}
         placeholderStyle={styles.text}
         selectedTextStyle={styles.text}
         onChange={item => {
           Alert.alert(item.label+" Button Clicked with id= "+value+" 🧚🏻 ")
           console.log(item.label+" was clicked! ") //item.label contains clicke office
         }}
        >
         <Text style={styles.text}>{label}</Text>
       </Dropdown>
       
      )
   })
}
 //Consejeria
 renderTableDropDownConsejeria() {
   return serviceConsejeria.map((service, index) => {
      const { label, value } = service //destructuring
      return (
         <Dropdown
         key={value}
         style={styles.button}
         data={consejeria}
         maxHeight={200}
         labelField="label"
         valueField="value"
         placeholder={label}
         placeholderStyle={styles.text}
         selectedTextStyle={styles.text}
         onChange={item => {
           Alert.alert(item.label+" Button Clicked with id= "+value+" 🧚🏻 ")
           console.log(item.label+" was clicked! ") //item.label contains clicke office
         }}
        >
         <Text style={styles.text}>{label}</Text>
       </Dropdown>
       
      )
   })
}
//Asistencia Academica
renderTableDropDownAsistenciaAcademica() {
   return serviceAsistenciaAcademica.map((service, index) => {
      const { label, value } = service //destructuring
      return (
         <Dropdown
         key={value}
         style={styles.button}
         data={asistenciaAcademica}
         maxHeight={280}
         labelField="label"
         valueField="value"
         placeholder={label}
         placeholderStyle={styles.text}
         selectedTextStyle={styles.text}
         onChange={item => {
           Alert.alert(item.label+" Button Clicked with id= "+value+" 🧚🏻 ")
           console.log(item.label+" was clicked! ") //item.label contains clicke office
         }}
        >
         <Text style={styles.text}>{label}</Text>
       </Dropdown>
       
      )
   })
}
//Asistencia Profesional
renderTableDropDownAsistenciaProfesional() {
   return serviceAsistenciaProfesional.map((service, index) => {
      const { label, value } = service //destructuring
      return (
         <Dropdown
         key={value}
         style={styles.button}
         data={asistenciaProfesional}
         maxHeight={150}
         labelField="label"
         valueField="value"
         placeholder={label}
         placeholderStyle={styles.text}
         selectedTextStyle={styles.text}
         onChange={item => {
           Alert.alert(item.label+" Button Clicked with id= "+value+" 🧚🏻 ")
           console.log(item.label+" was clicked! ") //item.label contains clicke office
         }}
        >
         <Text style={styles.text}>{label}</Text>
       </Dropdown>
       
      )
   })
}
//Matricula
renderTableDropDownMatricula() {
   return serviceMatricula.map((service, index) => {
      const { label, value } = service //destructuring
      return (
         <Dropdown
         key={value}
         style={styles.button}
         data={matricula}
         maxHeight={130}
         labelField="label"
         valueField="value"
         placeholder={label}
         placeholderStyle={styles.text}
         selectedTextStyle={styles.text}
         onChange={item => {
           Alert.alert(item.label+" Button Clicked with id= "+value+" 🧚🏻 ")
           console.log(item.label+" was clicked! ") //item.label contains clicke office
         }}
        >
         <Text style={styles.text}>{label}</Text>
       </Dropdown>
       
      )
   })
}

componentDidMount(){
   getAllOffices().then(res => {
      //console.log(res.data.data.offices) 
      this.setState({Offices:res.data.data.offices})
      res.data.data.offices.map((res, index) => {
         const { office_id, office_name } = res //destructuring
         console.log(office_id +":"+office_name)
   })
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
            Alert.alert(office_name+" Button Clicked with id= "+office_id+" 🧚🏻 ")
           // this.props.navigation.navigate('./HomeScreen');
         }
      }
         >
         <Text style={styles.text}>{office_name}</Text>
       </TouchableOpacity>
       </View>
      )
   })
}
    render() {
        return (
           <View style={styles.scrollView}>
             <ScrollView  id='students'> 
                      {this.renderTableDropDownNuevoIngreso()} 
                      {this.renderTableDropDownSeguridad()} 
                      {this.renderTableDropDownSalud()}
                      {this.renderTableDropDownConsejeria()}
                      {this.renderTableDropDownAsistenciaAcademica()}
                      {this.renderTableDropDownAsistenciaProfesional()}
                      {this.renderTableDropDownMatricula()} 
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
        fontSize: 26,
        color: '#029B36',
    },
    directoryDivisions:{
      fontSize: 20,
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