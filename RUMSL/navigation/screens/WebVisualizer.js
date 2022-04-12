import React  from 'react';
import { StyleSheet,SafeAreaView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
//uri: 'https://azure-map-test.herokuapp.com/'

const ActivityIndicatorElement = () => {
  //making a view to show to while loading the webpage
  return (
    <ActivityIndicator
       color="#009688"
       size="large"
       style={styles.activityIndicatorStyle}
    />
  );
}

export default function MyWeb() {
    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaView style ={{width:'100%', height:'100%'}}>
      {/* <WebView 
        renderLoading={ActivityIndicatorElement}
        startInLoadingState={true}
        javaScriptEnabled={true}
        source={{ uri: 'https://azure-map-test.herokuapp.com' }}
        style={{ marginTop: 0 }}
        onShouldStartLoadWithRequest={event => {if(event.url!='https://azure-map-test.herokuapp.com/') return false; return true;}}
        setSupportMultipleWindows={false}
      /> */}
      </SafeAreaView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
      },
  });