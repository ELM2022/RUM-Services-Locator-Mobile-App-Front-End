import * as React from 'react';
import{View,Text,StyleSheet,Dimensions,ScrollView,TouchableOpacity,Pressable, Alert, SafeAreaView, Platform, Linking } from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import {getAllOffices} from '../../handler/directoryHandler';
import { Button } from 'react-native-elements';
import { Magnetometer } from 'expo-sensors';
//import 'react-native-gesture-handler'

const { width, height } = Dimensions.get('window');
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
        livesRoutes : false,
        instructions: false,
        preview : false,
        renderCancel : false,
        renderInteractButton : false,
        intervalState : false,
        mapInteract : false,
        previewOffice : {},
        liveInterval: null,
        headingInterval: null,
        destination : {latitude: 18.2095366, longitude: -67.1407473},
        subscription: null,
        magnetometer: {},
        renderMarkers: true
       };
    }

    _subscribe(){
      this.setState({...this.state,subscription:Magnetometer.addListener((data)=>{
        this.state.magnetometer=this._angle(data)})
      })
    }

     _angle (magnetometer){
      let angle = 0;
      if (magnetometer) {
        let { x, y, z } = magnetometer;
        if (Math.atan2(y, x) >= 0) {
          angle = Math.atan2(y, x) * (180 / Math.PI);
        } else {
          angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
        }
      }
      return Math.round(angle);
    };

     async updateOrigin(){
            if (this.state.permissionStatus !== 'granted') {
                this.setState({...this.state,errorMsg:'Permission to access location was denied'})
                return;
              }
              let location = await Location.getCurrentPositionAsync({});
              this.setState({...this.state,location: location})
    }
    updateHeading(){
       this.state.headingInterval = setInterval(async() => {
          if(this.state.intervalState){
           this._map.setCamera({center: {latitude: this.state.location.coords.latitude,longitude: this.state.location.coords.longitude},pitch: 0, heading: this.state.magnetometer + 270,altitude: 0, zoom:20})
          }
     }, 125);
    }

    async startLiveRoute(){
        this._subscribe();
        Magnetometer.setUpdateInterval(250);
        this.updateHeading();
        this.state.liveInterval = setInterval(async() => {
          if(this.state.intervalState){
                      if (this.state.permissionStatus !== 'granted') {
                          this.setState({...this.state,errorMsg:'Permission to access location was denied'})
                          return;
                        }
                        let location = await Location.getCurrentPositionAsync({});
                        this.setState({...this.state,location: location})
                      }    
            }, 5000);
         }

         cancelLiveRoute(){
          clearInterval(this.state.liveInterval);
          clearInterval(this.state.headingInterval);
          this.state.intervalState = false;
          if(this.state.subscription !== null){
          this.state.subscription.remove();
          }
        }

                 

    async componentDidMount(){
        getAllOffices().then(res => {
            this.setState({...this.state,offices:res.data.data.offices})
         })
            let { status } = await Location.requestForegroundPermissionsAsync();
            this.setState({...this.state,permissionStatus:status})
            if (status !== 'granted') {
              this.setState({...this.state,errorMsg:'Permission to access location was denied'})
              return;
            }
            let location = await Location.getCurrentPositionAsync({});
            this.setState({...this.state,location: location})        
    }

    componentDidUpdate(prevProps) {
        if(prevProps == this.props){
          
        }
        else if(this.state.livesRoutes == true || this.state.instructions == true){
           Alert.alert("Favor salir de la navegación actual para proceder.")
           return;
        }
        else{
            const newLatitude = this.props.route.params.office_entrance_latitude
            const newLongitude = this.props.route.params.office_entrance_longitude
            if(newLatitude !== initialPosition.latitude && newLongitude !== initialPosition.longitude) {
                this.updateDestination(newLatitude, newLongitude,this.props.route.params)
                this.updateOrigin()
                this.mountRoute()
                
            }
        }
    }

    renderMarkers() {
        return this.state.offices.map((office, index) => {
            const {office_name, office_description, office_schedule, office_latitude, office_longitude, office_entrance_latitude, office_entrance_longitude, office_id} = office;
           let photoPath;
            if(Platform.OS == "android"){
              photoPath = require('../map/pawPinSmall.png')
            }
            else{
              photoPath = require('../map/small4.png')
            }
            return (
                <Marker
                key={index}
                ref={ref => this.state.officeMarker[index] = ref}
                id = {office_id}
                title={office_name}
                pinColor='#FFC5AA'
                coordinate={{latitude: office_latitude, longitude: office_longitude}}
                icon = {photoPath} 
                onPress = {() => {
                    this.updateDestination(office_entrance_latitude,office_entrance_longitude,office)  
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
                                title='Ver más'
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
                        this._map.fitToCoordinates(result.coordinates, {
                          edgePadding: {
                            right: (width / 20),
                            bottom: (height /20) +50,
                            left: (width / 20),
                            top: (height - 358),
                          }
                        });
                      }}
        /> 
        
        )
    }

    renderLiveRoutes() {
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
                            if(result.distance * FOOT_CONVERSION < 15){
                                this.state.subscription.remove();
                                this.state.subscription=null;
                                this.cancelLiveRoute();
                                this.state.routes = false;
                                this.state.livesRoutes = false;
                                this.state.renderCancel = false;
                                this.setState({...this.state,intervalState:false}) 
                                this.setState({...this.state, instructions: true})
                                this._map.animateToRegion({
                                  latitude: this.state.destination.latitude,
                                  longitude: this.state.destination.longitude,
                                  latitudeDelta: 0.008,
                                  longitudeDelta: 0.00755
                                });
                            }
                          }}
            /> 
            )
        }

        renderLiveRoutesWithoutAnimation() {
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
                          if(result.distance * FOOT_CONVERSION < 15){
                              this.state.routes = false;
                              this.state.livesRoutes = false;
                              this.state.renderCancel = false;
                              this.setState({...this.state,intervalState:false}) 
                              this.setState({...this.state, instructions: true})
                            
                          }
                        }}
          /> 
          )
      }

    renderPreviewDescription(){
        let item = this.state.previewOffice
        let webLink = item.office_website
        if(webLink == null){
          webLink = 'https://www.uprm.edu/'
        }
        return(
            <View style={styles.preview}>
            <View style={styles.carousel}>
        <View style={styles.cardContainer}>
            <ScrollView>
                <Text style={styles.cardTitle}>{item.office_name}</Text>
                <Text style={styles.cardHours}>{item.office_room_code}</Text>
                <Text style={styles.cardHours}>{item.office_schedule}</Text>
                <Text style={styles.cardHours}>{item.office_phone_number}</Text>
                <Text style={styles.cardHours}>{item.office_extension_number}</Text>
                <Text style={styles.cardImage}>{item.office_description}</Text>
                <Text style={{color: 'blue'}}
                  onPress={() => Linking.openURL(webLink)}>
                    ¡Acceda a su página a través de este enlace!
                </Text>
            </ScrollView>
        </View>
        </View>
        <View style={styles.buttons}>
        <Pressable
        style={styles.startButton}>
        <Text style={styles.textButton} 
        onPress={() => {
          this.state.renderMarkers = false;
            this.state.intervalState=true;
            this.state.routes=false;
            this.state.renderCancel = true;
           // this.state.renderInteractButton = true;
            this.state.livesRoutes = true;
            this.setState({...this.state, liveRoutes:true})
            this.startLiveRoute();
          }}
          >Comenzar</Text>
        </Pressable>
        <Pressable
        style={styles.cancelButton}
        onPress={() => {
            if(this.state.routes === true ){
                this.setState({...this.state,routes:false})    
            } 
          }}
        >
       <Text style={styles.textButton} >⏎ Regresar</Text>
        </Pressable>
        </View>
        </View>    
        )
    }

    renderCancelAndInteractButton(){
      let item = this.state.previewOffice
        return(
          <View style={styles.previewLive}>
          <View style={styles.carouselLive}>
        <View style={styles.cardContainerLive}>
                <Text style={styles.cardTitle}>Siga la ruta hacia:</Text>
                <Text style={styles.cardSubTitle}>{item.office_name}</Text>
        </View>
        </View>
        <View style={styles.cancelButtonView}>
           <Pressable style={styles.interactButton}>
            <Text style={styles.textButton} 
            onPress={() => {
              this.state.subscription.remove();
              this.cancelLiveRoute();
              this.state.subscription=null;
               this.state.mapInteract = true;
               this.setState({...this.state,mapInteract:true})
              this.state.renderCancel = false;
              }}
              >Interactuar con mapa</Text>
        </Pressable>
        <Pressable
        style={styles.cancelButtonLiveRoute}
        onPress={() => {
            this.cancelLiveRoute()
            this.state.renderMarkers = true;
            this.state.subscription.remove();
            this.state.subscription=null;
            this.state.routes = true;
            this.state.livesRoutes = false;
            this.state.renderCancel = false;
            this.setState({...this.state,intervalState:false}) 
          }}
        >
       <Text 
       style={styles.textButtonLiveRoute}
       >Cancelar</Text>
        </Pressable>
        </View>
        </View> 
        )
    }

    renderMapInteract(){
      let item = this.state.previewOffice
        return(
          <View style={styles.previewLive}>
          <View style={styles.carouselLive}>
        <View style={styles.cardContainerLive}>
                <Text style={styles.cardTitle}>Siga la ruta hacia:</Text>
                <Text style={styles.cardSubTitle}>{item.office_name}</Text>
        </View>
        </View>
        <View style={styles.cancelButtonView}>
           <Pressable style={styles.returnToNavigationButton}>
            <Text style={styles.textButton} 
            onPress={() => {
              this.state.mapInteract = false;
              this.state.renderMarkers = false;
                this.state.intervalState=true;
                this.state.routes=false;
                this.state.renderCancel = true;
               // this.state.renderInteractButton = true;
                this.state.livesRoutes = true;
                this.setState({...this.state, liveRoutes:true})
                this.startLiveRoute();
              }}
              >Regresar a Navegación</Text>
        </Pressable>
        <Pressable
        style={styles.cancelButtonLiveRoute}
        onPress={() => {          
          this.state.renderMarkers = true;
          this.state.mapInteract = false;
          this.state.routes = true;
          this.state.livesRoutes = false;
          this.state.renderCancel = false;
          this.setState({...this.state,intervalState:false}) 
        }}
        >
       <Text 
       style={styles.textButtonLiveRoute}
       >Cancelar</Text>
        </Pressable>
        </View>
        </View> 
        )
    }

    renderInstructions() {
        let item = this.state.previewOffice
        return( 
        <View style={styles.carousel}>
        <View style={styles.cardContainer}>
            <ScrollView>
                <Text style={styles.cardTitle}>{item.office_name}</Text>
                <Text style={styles.cardImage}>{item.office_route_instructions}</Text>
                <Text style={styles.cardHours}>{item.office_room_code}</Text>
            </ScrollView>
        </View>
        <View>
        <Pressable
        style={styles.finishButton}
        onPress={() => {
                if(this.state.instructions === true ){
                    this.state.renderMarkers = true;
                    this.setState({...this.state,instructions:false}) 
                }   
            } 
        }
        >
       <Text style={styles.textButton}>Listo</Text>
        </Pressable>
        </View>
        </View>
        )
    }

    renderEndMarker() {
      return (
        <Marker
        pinColor='#FFC5AA'
        coordinate={{latitude: this.state.destination.latitude, longitude: this.state.destination.longitude}}
        icon= {require('../map/endPin.png')} 
        />    
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
              <MapView
              toolbarEnabled = {false}
              showsMyLocationButton = {true}
              ref={map => this._map = map}
              provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialPosition}
                showsUserLocation={true}
              >
                  {this.state.renderMarkers && this.renderMarkers()}
                  {this.state.routes && this.renderRoutes()}
                  {this.state.livesRoutes && this.renderLiveRoutes()}  
            </MapView>
                   {this.state.routes && this.renderPreviewDescription()} 
                   {this.state.renderCancel && this.renderCancelAndInteractButton()}
                   {this.state.mapInteract && this.renderMapInteract()}
                   {this.state.mapInteract && this.renderLiveRoutesWithoutAnimation()}
                   {this.state.instructions && this.renderInstructions()}
            </View> 
        );
    }
}
export default GoogleMapHomeClass;

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      flex: 1, 
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
      carouselLive: {
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
      cardContainerLive: {
        backgroundColor: 'rgba(0,102, 0, 0.6)',
        height: 90,
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
      cardSubTitle: {
        color: 'white',
        fontSize: 18,
        alignSelf: 'center',
        fontWeight: "bold",
        textAlign: 'center'
      },
      cardHours: {
        color: 'white',
        fontSize: 14,
        alignSelf: 'center'
      },
      preview: {
        position: 'absolute',
        top: 0,
        alignItems: 'center'
      },
      previewLive: {
        position: 'absolute',
        top: 0,
        alignItems: 'center'
      },
      buttons: {
        position: 'absolute',
        bottom: 0,
        marginBottom:48
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
        bottom: (-0.95) * Dimensions.get('window').height,
        right: 48,
        width: (Dimensions.get('window').width / 2 ) - 50,
        borderRadius: 24 
      },
      interactButton: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#0080FF',
        position: 'absolute',
        bottom: (-0.95) * Dimensions.get('window').height,
        right: 48,
        width: (Dimensions.get('window').width / 2 ) - 50,
        borderRadius: 24 
      },
      returnToNavigationButton: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'green',
        position: 'absolute',
        bottom: (-0.95) * Dimensions.get('window').height,
        right: 48,
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
        bottom: (-0.95) * Dimensions.get('window').height,
        left:48,
        width: (Dimensions.get('window').width / 2 ) - 55,
        borderRadius: 24 
      },
      finishButton: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#0080FF',
        position: 'absolute',
        bottom: (-0.55) * Dimensions.get('window').height,
        marginBottom: 48,
        right:0,
        width: (Dimensions.get('window').width / 2 ) - 60,
        borderRadius: 24 
      },
      cancelButtonLiveRoute: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'red',
        position: 'absolute',
        bottom: (-0.95) * Dimensions.get('window').height,
        left:48,
        width: (Dimensions.get('window').width / 2 ) - 55,
        borderRadius: 24 
      },
      textButton: {
        fontSize: 12,
        color: 'white',
       
      },
      textButtonLiveRoute: {
        color: 'white',
       
      },
      cancelButtonView:{
        position: 'absolute',
        bottom: 0,
        marginBottom:48
      }
      
  });