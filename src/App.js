import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
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
      boundingBox: {},
      route: 'signin',
      isSignedIn: false
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

onRouteChange = (route) => {
  if(route==='signout'){
    this.setState({isSignedIn:false})
  }else if(route==='home'){
    this.setState({isSignedIn:true})
  }
  this.setState({route:route});
}

  render(){
    return (
      <div className="App">
        <Particles className='particles' params={particleOptions} />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home'
          ?  <div>
              <Logo />
              <Rank />
              <ImageLinkForm  onInputChange={this.onInputChange} 
                              onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition box={this.state.boundingBox} imageURL={this.state.imageURL}/>
            </div>
          : (
            this.state.route === 'signin' 
            ? <Signin onRouteChange={this.onRouteChange}/>
            : (
              this.state.route === 'signout' 
              ? <Signin onRouteChange={this.onRouteChange} />
              : <Register onRouteChange={this.onRouteChange} />
            )    
          )
        }
      </div>
    );
  }
}

export default App;
