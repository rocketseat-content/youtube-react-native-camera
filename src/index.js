import './config/ReactotronConfig';
import React, { Component } from 'react';

import {
  Text,
  TouchableOpacity,
  View,
  CameraRoll,
  Image,
  Modal,
  ScrollView
} from 'react-native';

import { RNCamera } from 'react-native-camera';

import styles from './styles';

export default class App extends Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    image: '',
    imagesCount: 0,
    imagesList: [],
    modalVisible: false,
  }

  takePicture = async () => {
    if (this.camera) {
      try {
        const options = {
          base64: true,
          forceUpOrientation: true,
          fixOrientation: true,
        };
        
        const data = await this.camera.takePictureAsync(options);

        this.setState({ image: data.uri });
      } catch (err) {
        alert(err);
      }
    }
  }

  saveImage = async () => {
    try {
      await CameraRoll.saveToCameraRoll(this.state.image);

      const { imagesCount } = this.state;

      this.setState({ image: '', imagesCount: imagesCount + 1 }, () => alert('Imagem salva com sucesso!'));
    } catch(err) {
      alert(err);
    }
  }

  newImage = () => {
    this.setState({ image: '' }, () => alert('Imagem descartada com sucesso!'));
  }

  toggleModalVisibility = async () => {
    const { modalVisible } = this.state;
    if ( !modalVisible ) {
      try {
        const images = await CameraRoll.getPhotos({
          first: this.state.imagesCount,
          assetType: 'Photos',
        });

        this.setState({ modalVisible: !modalVisible, imagesList: images.edges });
      } catch (err) {
        alert(err);
      }
    } else {
      this.setState({ modalVisible: !modalVisible });
    }
  }

  toggleScreen = () => (
    !!!this.state.image ? (
      <View style={styles.cameraContainer}>
        <RNCamera
          ref={camera => { this.camera = camera }}
          style={styles.camera}
          type={RNCamera.Constants.Type.front}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          flashMode={RNCamera.Constants.FlashMode.off}
          permissionDialogTitle={"Permission to use camera"}
          permissionDialogMessage={
            "We need your permission to use your camera phone"
          }
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.takePicture} style={styles.button}>
            <Text style={styles.buttonText}> Tirar Foto </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.toggleModalVisibility} style={styles.button}>
            <Text style={styles.buttonText}> Mostrar Galeria </Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View style={styles.container}>
        <Image source={{ uri: this.state.image }} style={styles.image} resizeMode="contain" />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.saveImage}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.newImage}>
            <Text style={styles.buttonText}>Tirar outra foto</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  )

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={this.toggleModalVisibility}
        >
          <View style={styles.modalContainer}>
            <ScrollView horizontal pagingEnabled >
              { this.state.imagesList.map(image => {
                console.tron.log(image);
                return (<Image
                  style={styles.modalImage}
                  source={{ uri: image.node.image.uri }}
                  key={image.node.image.uri}
                  resizeMode="contain"
                />)
              })}
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={this.toggleModalVisibility}>
                <Text style={styles.buttonText}>Voltar Para a galeria</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {this.toggleScreen()}
      </View>
    );
  }
}
