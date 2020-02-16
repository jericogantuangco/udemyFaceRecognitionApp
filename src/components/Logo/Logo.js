import React from 'react'
import Tilt from 'react-tilt'
import brain from './icons8-brain-100.png'

const Logo = () => {
    return(
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-1" options={{ max : 35 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner pa3"> <img className="ps3" alt='logo' src={brain}/> </div>
            </Tilt>
        </div>
    )
}


export default Logo;