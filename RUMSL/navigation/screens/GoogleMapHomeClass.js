import * as React from 'react';
import{View,Text,StyleSheet,Dimensions,ScrollView,TouchableOpacity,Pressable, Alert } from 'react-native';
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

  const FOOT_CONVERSION = 3280.84;

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
        previewBoolean : false,
        previewOffice : {},
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
          

            setInterval(async() => {
                  if (this.state.permissionStatus !== 'granted') {
                      this.setState({...this.state,errorMsg:'Permission to access location was denied'})
                      return;
                    }
                    let location = await Location.getCurrentPositionAsync({});
                    this.setState({...this.state,location: location})
          }, 5000);
          
    }

    componentDidUpdate(prevProps) {
        if(prevProps == this.props){
            // console.log("No Change")
        }
        else{
            const newLatitude = this.props.route.params.office_latitude
            const newLongitude = this.props.route.params.office_longitude
            if(newLatitude !== initialPosition.latitude && newLongitude !== initialPosition.longitude) {
                this.updateDestination(newLatitude, newLongitude,this.props.route.params)
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
                    this.updateDestination(office_latitude,office_longitude,office)  
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
    updateDestination = (office_latitude , office_longitude,office) => {
        this.state.previewOffice = office;
        this.updateOrigin();
        this.state.destination.latitude=office_latitude;
        this.state.destination.longitude=office_longitude;
        
    }
    

    mountRoute(){
        this.setState({...this.state,routes:true})
        console.log(this.state.routes)
        this._map.animateToRegion({
          latitude: this.state.destination.latitude + 0.0020132, //change in coords to fit preview properly under description
          longitude: this.state.destination.longitude + 0.0000405, // ^same
          latitudeDelta: 0.008,
          longitudeDelta: 0.00755
          });
    }
    renderRoutes() {
        async() => {
            if (this.state.permissionStatus !== 'granted') {
                this.setState({...this.state,errorMsg:'Permission to access location was denied'})
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            this.setState({...this.state,location: location})
        }
        

        return(
         <MapViewDirections
                    origin={{latitude: this.state.location.coords.latitude,longitude: this.state.location.coords.longitude}}
                    destination={{latitude: this.state.destination.latitude,longitude: this.state.destination.longitude}}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={7}
                    resetOnChange={false}
                    strokeColor="green"
                    mode ='WALKING'
                    onReady={result => {
                        console.log(`Distance to destination in km: ${result.distance}`)
                        console.log(`Distance to destination in feet is: ${result.distance * FOOT_CONVERSION}`)
                        if(result.distance * FOOT_CONVERSION < 20){
                            Alert.alert("You have arrived!!")
                        }
                    }}
        /> 
        )
    }
    renderPreviewDescription(){
        let item = this.state.previewOffice
        return(
            
            <View style={styles.carousel}>
        <View style={styles.cardContainer}>
            <ScrollView>
                <Text style={styles.cardTitle}>{item.office_name}</Text>
                <Text style={styles.cardHours}>{item.office_schedule}</Text>
                <Text style={styles.cardHours}>{item.office_phone_number}</Text>
                <Text style={styles.cardImage}>{item.office_description}</Text>
            </ScrollView>
        </View>
        <Pressable
        
        style={styles.startButton}>
        <Text style={styles.textButton} >Comenzar</Text>
        </Pressable>
        <Pressable
        style={styles.cancelButton}
        onPress={() => {
            if(this.state.routes === true ){
                this.setState({...this.state,routes:false})    
            } 
          }}
        >
       <Text style={styles.textButton} >Salir</Text>
        </Pressable>
        </View>
        
        
        )
    }
    
    hideRoute(){
        
        if(this.state.routes === true ){
            this.setState({...this.state,routes:false})    
        }  
    }

    render(){
        return(
            <View style={styles.container}>
            {/*Render our MapView*/}
            
              <MapView
              showsMyLocationButton = {true}
              ref={map => this._map = map}
              provider={PROVIDER_GOOGLE}
                style={styles.map}
                //specify our coordinates.
                initialRegion={initialPosition}
                showsUserLocation={true}
                onPress={() => {
                    if(this.state.routes === true ){
                        this.setState({...this.state,routes:false})    
                    } 
                  }}
              >
                  {this.renderMarkers()}
                  {this.state.routes && this.renderRoutes()}
            </MapView>
                   {this.state.routes && this.renderPreviewDescription()} 
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
      carousel: {
        position: 'absolute',
        top: 0,
        marginTop: 48
      },
      cardContainer: {
        backgroundColor: 'rgba(0,102, 0, 0.6)',
        height: 275,
        width: Dimensions.get('window').width - 5,
        padding: 24,
        borderRadius: 24
      },
      cardImage: {
        color: 'white',
        fontSize: 15,
        alignSelf: 'center'
      },
      cardTitle: {
        color: 'white',
        fontSize: 25,
        alignSelf: 'center',
        fontWeight: "bold",
        textAlign: 'center'
      },
      cardHours: {
        color: 'white',
        fontSize: 14,
        alignSelf: 'center'
      },
      startButton: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#0080FF',
        position: 'absolute',
        bottom: (-0.568) * Dimensions.get('window').height,
        marginBottom: 48,
        left: 0,
        width: (Dimensions.get('window').width / 2 ) - 50,
        borderRadius: 24
        
        
      },
      cancelButton: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'red',
        position: 'absolute',
        bottom: (-0.568) * Dimensions.get('window').height,
        marginBottom: 48,
        right:0,
        width: (Dimensions.get('window').width / 2 ) - 55,
        borderRadius: 24
        
        
        
      },
      textButton: {
        color: 'white',
       
      }
      
  });