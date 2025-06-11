import Phaser from 'phaser';
import { Introduction } from "./scenes/Introduction";
import { Grade9 } from "./scenes/Grade9";
import { IntroMathC1L1 } from './scenes/IntroMathC1L1';
//  Find out more information about the Game Config at: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
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
        IntroMathC1L1
    ]
};

export default new Phaser.Game(config);