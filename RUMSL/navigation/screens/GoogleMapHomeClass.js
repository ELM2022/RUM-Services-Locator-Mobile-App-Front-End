import * as React from 'react';
import{View,Text,StyleSheet} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import {getAllOffices} from '../../handler/directoryHandler';
import { Button } from 'react-native-elements';


const GOOGLE_MAPS_APIKEY = 'AIzaSyAQW5Yo0EM3l4Who0_9suk42tpMwbNSCG8';
let initialPosition = {
    latitude: 18.2122765,
    longitude: -67.1402712,
    latitudeDelta: 0.008,
    longitudeDelta: 0.00755
  };

class GoogleMapHomeClass extends React.Component {
    constructor(props) {
       super(props) //override Component class constructor
       this.state = {
        location : {coords: {latitude: 15.2096548, longitude: -65.14004434}},
        origin : {latitude: 18.2096548, longitude: -67.14004434},
        permissionStatus: '',
        errorMsg:'',
        offices: [],
        officeMarker:[],
        routes : false,
        destination : {latitude: 18.2095366, longitude: -67.1407473}
       };
    }

     async updateOrigin(){
        
            if (this.state.permissionStatus !== 'granted') {
                this.setState({...this.state,errorMsg:'Permission to access location was denied'})
                return;
              }
        
              let location = await Location.getCurrentPositionAsync({});
              this.setState({...this.state,location: location})
              //console.log("Updated 111 to: " + this.state.location.coords.latitude);
    }

    async componentDidMount(){
        getAllOffices().then(res => {
            this.setState({...this.state,offices:res.data.data.offices})
            console.log("get All Offices");
         })
            let { status } = await Location.requestForegroundPermissionsAsync();
            this.setState({...this.state,permissionStatus:status})
            if (status !== 'granted') {
              this.setState({...this.state,errorMsg:'Permission to access location was denied'})
              return;
            }
            //console.log(this.state.location.coords.latitude)
            let location = await Location.getCurrentPositionAsync({});
            this.setState({...this.state,location: location})
            //console.log(this.state.location.coords.latitude)
          

        //     setInterval(async() => {
        //           if (this.state.permissionStatus !== 'granted') {
        //               this.setState({...this.state,errorMsg:'Permission to access location was denied'})
        //               return;
        //             }
        //             let location = await Location.getCurrentPositionAsync({});
        //             this.setState({...this.state,location: location})
        //   }, 5000);
          
    }

    componentDidUpdate(prevProps) {
        if(prevProps == this.props){
            // console.log("No Change")
        }
        else{
            const newLatitude = this.props.route.params.office_latitude
            const newLongitude = this.props.route.params.office_longitude
            if(newLatitude !== initialPosition.latitude && newLongitude !== initialPosition.longitude) {
                this.updateDestination(newLatitude, newLongitude)
                this.mountRoute()
            }
        }
    }

    renderMarkers() {
        return this.state.offices.map((office, index) => {
            const {office_name, office_description, office_schedule, office_latitude, office_longitude,office_id} = office;
            return (
                <Marker
                key={index}
                ref={ref => this.state.officeMarker[index] = ref}
                id = {office_id}
                title={office_name}
                pinColor='#FFC5AA'
                coordinate={{latitude: office_latitude, longitude: office_longitude}}
                icon = {require('../map/pawPinSmall.png')} 
                onPress = {() => {
                    this.updateDestination(office_latitude,office_longitude)  
                }
            }
                >
                    <Callout
                    onPress = {() => {
                         this.mountRoute() 
                    }
                }>   
                                <Text>{office_name }</Text>
                                <Text>{office_schedule}</Text> 
                                <Button
                                title='Ver mas'
                                />

                               
                    </Callout>   
                </Marker>
            )
        })
    }
    updateDestination = (office_latitude , office_longitude) => {
        this.updateOrigin();
        this.state.destination.latitude=office_latitude;
        this.state.destination.longitude=office_longitude;
        
    }
    

    mountRoute(){
        this.setState({...this.state,routes:true})
        this._map.animateToRegion({
            latitude: this.state.destination.latitude,
            longitude: this.state.destination.longitude,
            latitudeDelta: 0.017,
            longitudeDelta: 0.01
          });
    }
    renderRoutes() {
        async() => {
            if (this.state.permissionStatus !== 'granted') {
                this.setState({...this.state,errorMsg:'Permission to access location was denied'})
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
           // console.log(await Location.getCurrentPositionAsync({}));
            this.setState({...this.state,location: location})
            //this.state.location=location;
        }

        return(
         <MapViewDirections
                    origin={{latitude: this.state.location.coords.latitude,longitude: this.state.location.coords.longitude}}
                    destination={{latitude: this.state.destination.latitude,longitude: this.state.destination.longitude}}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={7}
                    strokeColor="green"
                    mode ='WALKING'
        /> 
        )
    }

    render(){
        return(
            <View style={styles.container}>
            {/*Render our MapView*/}
            
              <MapView
              ref={map => this._map = map}
              provider={PROVIDER_GOOGLE}
                style={styles.map}
                //specify our coordinates.
                initialRegion={initialPosition}
                showsUserLocation={true}
                onPress={() => {
                    if(this.state.routes === true)
                        this.setState({...this.state,routes:false})
                  }}
              >
                  {this.renderMarkers()}
                  {this.state.routes && this.renderRoutes()}
            </MapView>
            </View>
           
            
        );
    }
}
export default GoogleMapHomeClass;

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      flex: 1, //the container will fill the whole screen.
      justifyContent: "flex-end",
      alignItems: "center",
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    popUp: {
        flexDirection:'row',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth:2,
        padding: 20,
      },
      
  });