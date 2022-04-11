import * as React from 'react';
import {  Searchbar } from 'react-native-paper';
import { View ,Text,Button,Alert,Keyboard} from 'react-native';

const MyComponent = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);
  return (
    <View>
        <Searchbar
      placeholder="Search"
      onChangeText={onChangeSearch}
      value={searchQuery}
    />
    <Text >
      Ingrese servicio que esta buscanco...
    </Text>
    <Button
      title="Test Input"
      onPress={() => Alert.alert(searchQuery) && Keyboard.dismiss} // Value stored in search bar
    />
  </View>
  );
};

export default MyComponent;