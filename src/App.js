import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Signin from './components/Signin/Signin'
import './App.css';
import Clarifai from 'clarifai'

const clarifaiApp = new Clarifai.App({
  apiKey: '09bdc49dcc5c48ffbe21cecd1ecb972c'
});

const particleOptions = {
  "particles": {
    "number": {
        "value": 50
    },
    "size": {
        "value": 3
    }
  },
  "interactivity": {
      "events": {
          "onhover": {
              "enable": true,
              "mode": "repulse"
          }
      }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      boundingBox: {

      }
    }
  }

  calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftColumn: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightColumn: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    }

  displayFaceBox = (box) => {
    this.setState({boundingBox: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () =>{
    this.setState({imageURL:this.state.input});
    clarifaiApp.models.predict( Clarifai.FACE_DETECT_MODEL, 
                                this.state.input)
    .then(
      (response) => {
        // do something with response
        this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch((err) => {throw err;})
  }

  render(){
    return (
      <div className="App">
        <Particles className='particles' params={particleOptions} />
        <Navigation />
        <Signin />
        <Logo />
        <Rank />
        <ImageLinkForm  onInputChange={this.onInputChange} 
                        onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition box={this.state.boundingBox} imageURL={this.state.imageURL}/>
      </div>
    );
  }
}

export default App;
