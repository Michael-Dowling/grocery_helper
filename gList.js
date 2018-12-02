import React, {Component} from 'react';
import ReactNative from 'react-native';
import Dialog from 'react-native-dialog';
import DialogContainer from 'react-native-dialog/src/Container';
const firebase = require('firebase');
const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');
const styles = require('./styles.js')

const {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Alert,
} = ReactNative;

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBYg-JdPbI8vUabkyB92s42RlBs9bRhlH4",
  authDomain: "groceryhelper-d8975.firebaseapp.com",
  databaseURL: "https://groceryhelper-d8975.firebaseio.com",
  storageBucket: "groceryhelper-d8975.appspot.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class gList extends Component {
  constructor(props) {
    super(props);
    this.itemsRef = this.getRef().child('items');
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      dialogVisible : false,
      quanDialogVisible : false,
      updateDialogVisible : false,
      key : a
    };
    this.setState({dialogVisible: true})
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {
      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val()['grocery'] + " - " + child.val()['quantity'],
          _key: child.key
        });
      });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }
  handleCancel = () => {
    this.setState({ dialogVisible: false });
    this.setState({ quanDialogVisible: false });
    this.setState({ updateDialogVisible: false });
  };
  handleAdd = () => {
    var grocery = this.state.grocery;
    var quantity = this.state.quantity;
    this.itemsRef.push({
      grocery,
      quantity
    });
    this.setState({quanDialogVisible: false});
  }

  scanBarcode(){
    var barcode = "055577420232";
    var quantity = "4";
    firebase.database().ref('UPCs/'+barcode).once('value',function (snapshot) {
      var grocery = snapshot.val();
      console.log(snapshot.val());
      console.log(grocery + " " + quantity);
      firebase.database().ref('items/').push({
        grocery,
        quantity
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar title="Food at Home" />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>

        <ActionButton onPress={this._addItem.bind(this)} title="Add" />
        <ActionButton onPress={this.scanBarcode.bind(this)} title="Scan Barcode"/>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Add Groceries</Dialog.Title>
          <Dialog.Button label="Cancel" onPress={this.handleCancel}/>
          <Dialog.Button label="Add" onPress={this.getQuantity}/>
          <Dialog.Input label="Type below:"
            value={this.state.grocery}
            onChangeText={grocery => this.setState({grocery})}>
          </Dialog.Input>
        </Dialog.Container>
        <Dialog.Container visible={this.state.quanDialogVisible}>
          <Dialog.Title>Add Groceries</Dialog.Title>
          <Dialog.Button label="Cancel" onPress={this.handleCancel}/>
          <Dialog.Button label="Add" onPress={this.handleAdd}/>
          <Dialog.Input label="Enter quantity:"
            value={this.state.quantity}
            onChangeText={quantity => this.setState({quantity})}>
          </Dialog.Input>
        </Dialog.Container>
        <Dialog.Container visible={this.state.updateDialogVisible}>
          <Dialog.Title>Update Grocery Quantities</Dialog.Title>
          <Dialog.Button label="Cancel" onPress={this.handleCancel}/>
          <Dialog.Button label="Add" onPress={this.updateValues}/>
          <Dialog.Input label="Enter new quantity:"
            value={this.state.nQuantity}
            onChangeText={nQuantity => this.setState({nQuantity})}>
          </Dialog.Input>
        </Dialog.Container>
      </View>
    )
  }

  getQuantity = () => {
    this.setState({dialogVisible: false});
    this.setState({quanDialogVisible: true});
  }
  _addItem() {
    this.setState({dialogVisible: true});
  }

  updateValues = () => {
    this.setState({updateDialogVisible: false});
    var nQuantity = this.state.nQuantity;
    var ref = firebase.database().ref('items/'+this.state.key);
    if(nQuantity != '0'){
      ref.update({quantity: nQuantity});
    }
    else{
      ref.remove();
    }
  }
  _renderItem(item) {

    const onPress = () => {
      var key = item._key;
      console.log(key);
      this.setState({key: key});
      this.setState({updateDialogVisible: true});
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }
  

}

AppRegistry.registerComponent('FirebaseReactNativeSample', () => FirebaseReactNativeSample);