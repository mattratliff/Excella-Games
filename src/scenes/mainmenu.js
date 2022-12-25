import Phaser from 'phaser';
import mainmenu from '../assets/boards/mainmenu/mainmenu.png';
import hand from '../assets/boards/mainmenu/hand.png';
import audio from '../assets/boards/mainmenu/audio.png';
import noaudio from '../assets/boards/mainmenu/no-audio.png';
import sounds from '../assets/sounds/processed';
import constants from '../config/constants';

// var utils = require('../helpers/util');
const settings = require('../config/config.json');

const { WIDTH, HEIGHT, SCALE } = constants;

const center = {
  width: WIDTH * 0.5,
  height: HEIGHT * 0.5
};

const assetScale = SCALE;
const timeBeforeShowingLanding = 1000;

 var cursors;
 var counter = 0;

export default class MainMenu extends Phaser.Scene {

  menuItems = [
    { name: "Pong", index: 0 },
    { name: "Tank Battle", index: 1 },
    { name: "Pac Man", index: 2 },
    { name: "Asteroids", index: 3 },
    { name: "Missle Command", index: 4 },
    { name: "Legend of Zelda", index: 5 },
    { name: "Tetris", index: 6 },
    { name: "AI Game 1", index: 7 },
  ];

  constructor() {
    super({ key: 'MainMenu' });
    this.musicplaying = settings["music"];
    this.showSplashScreen = true;   //determines if you want to show a splash screen after a certain amount of time of inactivity
    this.selection = 0;       //your current menu option selection
    this.numberEntries = this.menuItems.length;   //number of main menu options
  }

  /**
   * Preload the main menu board
   */
  preloadBackground() {
    this.load.image('mainmenu', mainmenu);
  }

  /**
   * Add the main menu board
   */
  createBackground(scale) {
    this.add
      .image(center.width, center.height, 'mainmenu')
      .setScale(scale);
  }

  /**
   * Preload the assets
   */
  preload() {
    cursors = this.input.keyboard.createCursorKeys();
    this.preloadBackground();
    this.load.image('hand', hand);
    this.load.image('audio', audio);
    this.load.image('noaudio', noaudio);
  }

  /**
   * Add the components and register the input handler
   */
  create() {
    this.createBackground(assetScale);
    this.addComponents();
    this.makeText();
    this.inputHandler();
    if(this.musicplaying)
      this.playMusic();
  }

  /**
   * Starts the game and starts the scene based on the users current selection
   */
  startGame(){
    this.scene.start(this.menuItems[this.selection].name)
  }

  /**
   * Register the input events
   */
  inputHandler(){
    this.input.on('pointerdown', this.toggleMusic, this);
    this.input.on('pointermove', this.resetTimer, this);
    this.input.keyboard.on('keydown-ENTER', this.startGame, this);
  }


  /**
   * Create the assets
   */
  addComponents(){
    var audiox = WIDTH-100;
    var audioy = 100;
    
    //add pointer to select options
    this.hand = this.add.image(50, 125, 'hand').setScale(assetScale);

    //audio icons
    this.audio = this.add.image(audiox, audioy, 'audio');
    this.audio.visible = true;
    this.noaudio = this.add.image(audiox, audioy, 'noaudio');
    this.noaudio.visible = false;

    var height = 100;
    this.menuItems.forEach(option => {
      this.menuoption1 = this.add.text(150, height, option.name, {
        fill: '#FFFFFF',
        font: `${20 * SCALE}pt Silom`
      });
      height += 85;
      this.menuoption1.visible = true;
    })
  }


  /**
   * Resets the splash screen after timer event expired
   */
  resetTimer(){
    if(this.showSplashScreen){
      this.showSplashScreen = false;
    }
    counter = 0;
  }

  /**
   * Game loop
   */
  update() {
    counter++;
    this.transitionToSpashScreen(counter);
    this.moveCursor(counter);
  }

  //transition to spash screen if no input detected
  transitionToSpashScreen(counter){
    if(counter > timeBeforeShowingLanding){
      this.scene.switch('LeaderBoard');
      this.showleaderboard = true;
      counter = 0;
    }
  }

  //check for cursor movements
  moveCursor(){
    if(this.input.keyboard.checkDown(cursors.up, 250))
    {
      counter = 0;
      if(this.selection > 0){
        this.hand.y = this.hand.y - 82;
        this.selection--;
      }
    }
    if(this.input.keyboard.checkDown(cursors.down, 250))
    {
      counter = 0;
      if(this.selection < this.numberEntries-1){
        this.hand.y = this.hand.y + 82;
        this.selection++;
      }
    }
  }

  render() {}

  /**
   * Play background music
   */
  playMusic = () => {
    this.backgroundMusic = sounds.play('Main_Menu');
    sounds.loop(true, this.backgroundMusic);
    sounds.volume(0.6, this.backgroundMusic);
  };

  /**
   * Toggles the background music on/off
   */
  toggleMusic() {
    if(!this.musicplaying){
      sounds.volume(0, this.backgroundMusic);
      this.audio.visible = false;
      this.noaudio.visible = true;
    }
    else{
      sounds.volume(0.6, this.backgroundMusic);
      this.audio.visible = true;
      this.noaudio.visible = false;
    }
    this.musicplaying = !this.musicplaying;
  }

  /**
   * Generates the text on the main menu
   */
  makeText() {
    this.titleText = this.add
      .text(center.width, 100, 'Excella Game Dev Labs', {
        fill: '#ffffff',
        font: `${60 * SCALE}px Rajdhani`
      })
      .setOrigin(0.5, 0.5)
      .setAlpha(0);

    this.textTween = this.tweens.add({
      targets: this.titleText,
      alpha: {
        value: 1,
        delay: 2000,
        duration: 5000
      }
    });

    this.textTween = this.tweens.add({
      targets: [this.startText],
      alpha: {
        value: 1,
        delay: 7000,
        duration: 5000
      }
    });
  }
}
