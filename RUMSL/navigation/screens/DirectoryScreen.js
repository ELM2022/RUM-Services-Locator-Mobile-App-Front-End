import React, { Component } from 'react'
import { StyleSheet,ScrollView,TouchableOpacity,Text,Alert } from 'react-native'

class Table extends Component {
   constructor(props) {
      super(props) //override Component class constructor
      this.state = { //state is by default an object
         Offices: [ //Offices object to be replaced from Database call with proper Active Offices.
            { id :'1', name: 'Cafetería' },
            { id :'2', name: 'Oficina de ID'},
            { id :'3', name: 'Colocaciones'},
            { id :'4', name: 'Actividades Sociales y Culturales'},
            { id :'5', name: 'Consejería Profesional' },
            { id :'6', name: 'Servicios Psicológicos'},
            { id :'7', name: 'Merendero'},
            { id :'8', name: 'Librería'},
            { id :'9', name: 'Oficina Intercambio' },
            { id :'10', name: 'Registraduría'},
            { id :'11', name: 'Procuraduría'},
            { id :'12', name: 'Estudios Graduados'},
            { id :'13', name: 'Admisiones' },
            { id :'14', name: 'CIVIS'},
            { id :'15', name: 'RUMbo Ex'},
            { id :'16', name: 'Asisencia Económica'},
            { id :'17', name: 'Servicios Médicos' },
            { id :'18', name: 'Tránsito y Vigilancia'},
            { id :'19', name: 'Seguridad'},
            { id :'20', name: 'Recaudaciones'},
         ]
      }
   }

   renderTableData() {
    return this.state.Offices.map((office, index) => {
       const { id, name } = office //destructuring
       return (
          <TouchableOpacity
          key={id}
          style={styles.button}
          onPress={() => Alert.alert(name+" Button Clicked with id= "+id+" 🧚🏻 ")}>
          <Text style={styles.text}>{name}</Text>
        </TouchableOpacity>
       )
    })
 }

    render() {
        return (
        <ScrollView id='students'>
                    {this.renderTableData()}
        </ScrollView>
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
    }
  });