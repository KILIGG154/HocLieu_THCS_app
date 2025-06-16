import Phaser from 'phaser';
import { Introduction } from "./scenes/Introduction";
import { Grade9 } from "./scenes/Grade9";
import { Grade8 } from './scenes/Grade8';
import { IntroMathC1L1 } from './scenes/IntroMathC1L1';
import { IntroMathC1L2 } from './scenes/IntroMathC1L2';
import { IntroMathC1L3 } from './scenes/IntroMathC1L3';
import { LinearEquation } from './scenes/LinearEquation';
import { History1 } from './scenes/History1';
import { History2 } from './scenes/History2';  
import { QuadraticFunction } from './scenes/QuadraticFunction';    
import { History3 } from './scenes/History3';
//  Find out more information about the Game Config at: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    dom: {
        createContainer: true
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 }
        }
    },
    scene: [
        Introduction,
        Grade9,
        IntroMathC1L1,
        IntroMathC1L2,
        IntroMathC1L3,
        LinearEquation,
        Grade8,
        History1,
        History2,
        QuadraticFunction,
        History3
    ]
};

export default new Phaser.Game(config);