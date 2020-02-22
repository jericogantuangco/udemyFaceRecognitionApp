import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
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
      imageURL: ''
    }
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () =>{
    this.setState({imageURL:this.state.input});
    clarifaiApp.models.predict( Clarifai.FACE_DETECT_MODEL, 
                                this.state.input).then(
      function(response) {
        // do something with response
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      },
      function(err) {
        // there was an error
      }
    );
    console.log('click');
  }

  render(){
    return (
      <div className="App">
        <Particles className='particles' params={particleOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm  onInputChange={this.onInputChange} 
                        onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition imageURL={this.state.imageURL}/>
      </div>
    );
  }
}

export default App;
