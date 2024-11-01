// https://alampros.github.io/react-confetti/?path=/story/props-demos--knobs&knob-Run=true&knob-Recycle=&knob-# Pieces=280&knob-Wind=0&knob-Gravity=0.1&knob-Initial X=4&knob-Initial Y=10&knob-Opacity=100

import React from 'react'

import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'


function ConfettiUI({ customHeight, customGv }) {
    const { width, height } = useWindowSize();

    return (
        <Confetti
            width={width}
            height={customHeight || height}
            numberOfPieces={width < 600 ? 100 : 150}
            gravity={customGv || 0.08}
            tweenDuration={5000}
        />
    )
}

export default ConfettiUI