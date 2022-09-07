import React from 'react';
import Timer from './components/Timer';
import FlagCounter from './components/FlagCounter';
import RestartButton from './components/RestartButton';
import Field from './components/Field';
import Settings from './components/Settings';
import WinOrLooseMessage from './components/WinOrLooseMessage';
import Statistics from './components/Statistics';

import flagIcon from './components/icons/flag.png'
import bombIcon from './components/icons/bomb.png'

import './App.css';

import confetti from 'canvas-confetti';


function randomInt(max) {
  return Math.floor(Math.random() * max);
}

const localStorage = window.localStorage;

const Icon = props => {
  return <img src={props.image} alt='img' className='icon' />
}

class App extends React.Component{
  constructor(props){
    super(props)

    this.state = ({
      fieldHeight: 9,
      fieldWidth: 9
    })

    let filledArray = Array.from(Array(this.state.fieldHeight), () => new Array(this.state.fieldWidth));
    for (let i = 0; i < this.state.fieldHeight; i++) {
      for (let j = 0; j < this.state.fieldWidth; j++){
        filledArray[i][j] = {position: [i,j], val: '0', flagPlaced: false, opened: false, isChecked: false};
      }
    }

      this.state = ({
      workArray: filledArray,
      fieldArray: [],
      flagsLeft: 10,
      bombs: 10,
      flags: 10,
      fieldHeight: 9,
      fieldWidth: 9,
      bombsOnFieldNow: 0,
      loose: false,
      openedCells: 0,
      showSettings: false,
      gameIsStarted: false,
      elapsedTime: 0,
      colorForFlagsCounter: {color:'white'},
      smile: '🙂',
      moves: 0,
      beginnerBest: (localStorage.getItem('minesweeperBeginnerBest') ? localStorage.getItem('minesweeperBeginnerBest').split('+') : [0, 0]),
      amateurBest: (localStorage.getItem('minesweeperAmateurBest') ? localStorage.getItem('minesweeperAmateurBest').split('+') : [0, 0]),
      professionalBest: (localStorage.getItem('minesweeperProfessionalBest') ? localStorage.getItem('minesweeperProfessionalBest').split('+') : [0, 0]),
      confetiLaunched: false,
    })
  }

  handleLaunchConfeti = () => {
    this.setState({
      confetiLaunched:  true,
    })
    const colors = ['#ff0000', '#800080', '#ffa500', '#FFFF00', '#00ff00', '#F0FFFF', '#0000ff'];
    const interval = setInterval(() => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
      if (this.state.confetiLaunched === false){
        clearInterval(interval)
      }
    }, 30)
  };

  startTimer = () => {
    let timerInterval = setInterval(() => {
      if (this.state.gameIsStarted === false){
        clearInterval(timerInterval)
      }else{
        this.setState({
          elapsedTime: this.state.elapsedTime + 10
        })
      }
    },10)
  }

  handleClick = (posI, posJ) => {
    if (this.state.gameIsStarted === false){
      this.setState({
        gameIsStarted: true
      },this.startTimer)

    }
    let checkIfLoose = false;
    if (!this.state.loose){
      this.setState ({
        workArray: this.state.workArray.map(element => {
          element.map(nestedElement => {
            if (nestedElement.position[0] === posI && nestedElement.position[1] === posJ) {
              if (nestedElement.flagPlaced === false){

                if (nestedElement.opened === false){
                  this.setState({moves: this.state.moves+1})
                }

                nestedElement.opened = true;
                if (nestedElement.val === 'b'){
                  checkIfLoose = true;
                }
              }
            }
            return nestedElement;
          })
          return element;
        })
      })
      this.checkNeiborsForEmpty(posI, posJ);

      if (checkIfLoose) {
        this.setState ({
          loose: true,
          gameIsStarted: false,
          smile: "😖"
        })
        this.openBombs();
      }
      this.checkForWin();
      this.renderTable();
    }
  }

  openBombs = () => {
    this.setState({
      workArray: this.state.workArray.map(element => {
        element.map(nestedElement => {
          if (nestedElement.val === 'b'){
            nestedElement.opened = true;
          }
          return nestedElement;
        })
        return element;
      })
    }, this.renderTable)
  }

  fillArray = () => {
    let filledArray = Array.from(Array(this.state.fieldHeight), () => new Array(this.state.fieldWidth));
    for (let i = 0; i < this.state.fieldHeight; i++) {
      for (let j = 0; j < this.state.fieldWidth; j++){
        filledArray[i][j] = {position: [i,j], val: 'e', flagPlaced: false, opened: false, isChecked: false};
      }
    }
    this.setState ({
      workArray: filledArray
    }, this.placeBombs)
  }

  checkForWin = () => {
    let tempArr = this.state.workArray;
    let openedCells = this.countOpenedCells(tempArr)
    let opennedForWin = this.state.fieldHeight * this.state.fieldWidth - this.state.bombs;
    this.setState({
      openedCells: openedCells
    })
    if (openedCells === opennedForWin && !this.state.loose){

      this.handleLaunchConfeti()


      if (this.state.fieldHeight === 9 && this.state.fieldWidth === 9 && this.state.bombs === 10){
        if(this.state.beginnerBest[1] === 0 || this.state.elapsedTime < this.state.beginnerBest[1]){
          this.setState({beginnerBest: [this.state.moves, this.state.elapsedTime]})
          localStorage.setItem('minesweeperBeginnerBest', [this.state.moves, this.state.elapsedTime].join('+'))
        }
      }
      if (this.state.fieldHeight === 16 && this.state.fieldWidth === 16 && this.state.bombs === 40){
        if(this.state.amateurBest[1] === 0 || this.state.elapsedTime < this.state.amateurBest[1]){
          this.setState({amateurBest: [this.state.moves, this.state.elapsedTime]})
          localStorage.setItem('minesweeperAmateurBest', [this.state.moves, this.state.elapsedTime].join('+'))
        }
      }
      if (this.state.fieldHeight === 16 && this.state.fieldWidth === 30 && this.state.bombs === 99){
        if(this.state.professionalBest[1] === 0 || this.state.elapsedTime < this.state.professionalBest[1]){
          this.setState({professionalBest: [this.state.moves, this.state.elapsedTime]})
          localStorage.setItem('minesweeperProfessionalBest', [this.state.moves, this.state.elapsedTime].join('+'))
        }
      }

      this.setState ({
        win: true,
        gameIsStarted: false,
        smile: '😎',
        workArray: this.state.workArray.map(element => {
          element.map(nestedElement => {
            if (!nestedElement.opened) {
              nestedElement.flagPlaced = true;
            }
            return nestedElement
          })
          return element
        })
      })
    }
  }

  countOpenedCells = (arr) => {

    const openedCells = arr.reduce((acc, currentElement) =>{
      let sumInRows = currentElement.reduce((acc, currentNestedElement) => {
        if (currentNestedElement.opened === true){
          acc = acc + 1;
        }
        return acc
      }, 0)
      return acc + sumInRows;
    }, 0)
    return openedCells;
  }

  placeBombs = () => {
    let tempArr = this.state.workArray;
    const checkBombsCount = tempArr.reduce((acc, currentElement) =>{
      let sumInRows = currentElement.reduce((acc, currentNestedElement) => {
        if (currentNestedElement.val === 'b'){
          acc = acc + 1;
        }
        return acc;
      }, 0)
      return acc + sumInRows;
    }, 0)


    if (checkBombsCount < this.state.bombs){

      for (let i = 0; i < this.state.bombs; i++){
        let randI = randomInt(this.state.fieldHeight);
        let randJ = randomInt(this.state.fieldWidth);
        if (tempArr[randI][randJ].val !== 'b') {
           tempArr[randI][randJ].val = 'b'
        } else{
          i--;
        }
      }
      this.setState ({
        workArray: tempArr
      }, this.countNumbersNearBombs)
    }

    const bombsOnFieldNow = tempArr.reduce((acc, currentElement) =>{    // delete it later
      let sumInRows = currentElement.reduce((acc, currentNestedElement) => {
        if (currentNestedElement.val === 'b'){
          acc = acc + 1;
        }
        return acc;
      }, 0)
      return acc + sumInRows;
    }, 0)

    this.setState ({
      bombsOnFieldNow: bombsOnFieldNow
    })       // delete it later

  }

  countNumbersNearBombs = () => {
    let tempArr = this.state.workArray;
    for (let i = 0; i < this.state.fieldHeight; i++){
      for (let j = 0; j < this.state.fieldWidth; j++){
        if (tempArr[i][j].val !== 'b')  {            //skip bombs
          let numerOfBombs = 0;
          if (i-1 >= 0 && j-1 >=0){                     // left top corner
            if (tempArr[i-1][j-1].val === 'b'){
              numerOfBombs++
            }
          }
          if (i-1 >= 0){                                  // up
            if (tempArr[i-1][j].val === 'b'){
              numerOfBombs++
            }
          }
          if (i-1 >= 0 && j+1 < this.state.fieldWidth){  // right top corner
            if (tempArr[i-1][j+1].val === 'b'){
              numerOfBombs++
            }
          }
          if (j-1 >= 0){                                  // left
            if (tempArr[i][j-1].val === 'b'){
              numerOfBombs++
            }
          }

          if (j+1 < this.state.fieldWidth){               // right
            if (tempArr[i][j+1].val === 'b'){
              numerOfBombs++
            }
          }

          if (i+1 < this.state.fieldHeight && j-1 >= 0){   // left bottom corner
            if (tempArr[i+1][j-1].val === 'b'){
              numerOfBombs++
            }
          }

          if (i+1 < this.state.fieldHeight){                // bottom
            if (tempArr[i+1][j].val === 'b'){
              numerOfBombs++
            }
          }

          if (i+1 < this.state.fieldHeight && j+1 < this.state.fieldWidth){   // right bottom corner
            if (tempArr[i+1][j+1].val === 'b'){
              numerOfBombs++
            }
          }
          tempArr[i][j].val = numerOfBombs;
        }
      }
    }
    this.setState ({
      workArray: tempArr
    },this.renderTable)
  }

  checkNeiborsForEmpty = (posI, posJ) => {
    let tempArr = this.state.workArray;

    if (tempArr[posI][posJ].val === 0) {
      tempArr = this.openNeibors(posI, posJ, tempArr)
    }

    tempArr = this.openEmptyCellsOnField(tempArr)

    this.setState ({
      workArray: tempArr
    },this.renderTable)
  }

  openNeibors = (posI, posJ, arr) => {

        if (arr[posI][posJ].val !== 'b')  {            //skip bombs
          if (posI-1 >= 0 && posJ-1 >=0){                     // left top corner
              arr = this.openCellAndReturnFlag(posI-1, posJ-1, arr)
          }
          if (posI-1 >= 0){                                  // up
              arr = this.openCellAndReturnFlag(posI-1, posJ, arr)
          }
          if (posI-1 >= 0 && posJ+1 < this.state.fieldWidth){  // right top corner
              arr = this.openCellAndReturnFlag(posI-1, posJ+1, arr)
          }
          if (posJ-1 >= 0){                                  // left
              arr = this.openCellAndReturnFlag(posI, posJ-1, arr)
          }
          if (posJ+1 < this.state.fieldWidth){               // right
              arr = this.openCellAndReturnFlag(posI, posJ+1, arr)
          }
          if (posI+1 < this.state.fieldHeight && posJ-1 >= 0){   // left bottom corner
              arr = this.openCellAndReturnFlag(posI+1, posJ-1, arr)
          }
          if (posI+1 < this.state.fieldHeight){                // bottom
              arr = this.openCellAndReturnFlag(posI+1, posJ, arr)
          }
          if (posI+1 < this.state.fieldHeight && posJ+1 < this.state.fieldWidth){   // right bottom corner
              arr = this.openCellAndReturnFlag(posI+1, posJ+1, arr)
          }
          arr[posI][posJ].isChecked = true;
        }
        return arr;
  }

  openCellAndReturnFlag = (posI, posJ, arr) => {
    arr[posI][posJ].opened = true;
    if (arr[posI][posJ].flagPlaced === true){
      arr[posI][posJ].flagPlaced = false;
      this.setState(prevState => ({
        flagsLeft: prevState.flagsLeft + 1
      }))
    }
    return arr
  }

  openEmptyCellsOnField = (arr) => {
    let prevOpenedCells = 0, openedCells = 0;
    do{
      prevOpenedCells = this.countOpenedCells(arr);

      for (let i = 0; i < this.state.fieldHeight; i++){
        for (let j = 0; j < this.state.fieldWidth; j++){
          if (arr[i][j].val === 0 && arr[i][j].opened && !arr[i][j].isChecked){
            arr = this.openNeibors(i, j, arr);
          }
        }
      }

      openedCells = this.countOpenedCells(arr);
    }while(prevOpenedCells !== openedCells);
    return arr;
  }

  handlePlaceFlag = (posI, posJ, event) => {
    event.preventDefault();
      let flagsLeft = this.state.flagsLeft;
      this.setState ({
        workArray: this.state.workArray.map(element => {
          element.map(nestedElement => {
            if (nestedElement.position[0] === posI && nestedElement.position[1] === posJ) {
              if (this.state.loose){
              }else{
                if (nestedElement.opened === false){
                  if (nestedElement.flagPlaced === false){
                    if (this.state.flagsLeft <= 0) {
                      this.setState({
                        colorForFlagsCounter: {color:'red'}
                      })
                      let i = 1;  //?????????????????????????????????????????????????????????????????????
                      let interval = setInterval(() => {
                        if (i === 5){
                          clearInterval(interval)
                        }
                        if (i % 2 === 0) {
                          this.setState({
                            colorForFlagsCounter: {color:'red'}
                          })
                        }else{
                          this.setState({
                            colorForFlagsCounter: {color:'white'}
                          })
                        }
                        i++
                      }, 100)
                    }else{
                      nestedElement.flagPlaced = true;
                      flagsLeft--;
                    }
                  }else{
                    nestedElement.flagPlaced = false;
                    flagsLeft++;
                  }
                }
              }
            }
            return nestedElement;
          })
          return element;
        })
      })
      this.setState ({
        flagsLeft: flagsLeft
      })
       this.renderTable()
  }

  restartGame = () => {
    this.setState ({
      flagsLeft: this.state.flags,
      loose: false,
      win: false,
      elapsedTime: 0,
      gameIsStarted: false,
      smile: '🙂',
      moves: 0,
      confetiLaunched: false,
    }, this.fillArray)
  }

  setStyleForNumbers = (value) => {
    switch(value){
      case 1: return 'opened-cell one';
      case 2: return 'opened-cell two';
      case 3: return 'opened-cell three';
      case 4: return 'opened-cell four';
      case 5: return 'opened-cell fife';
      case 6: return 'opened-cell six';
      case 7: return 'opened-cell seven';
      case 8: return 'opened-cell eight';
      default: return 'opened-cell';
    }
  }

  changeSmile = (smile) => {
    this.setState({
      smile: smile
    })
  }

  renderTable = () => {
    let tempArr = this.state.workArray;
    let filledArrayForTable = [];
    for (let i = 0; i < this.state.fieldHeight; i++) {
      let row = [];
      for (let j = 0; j < this.state.fieldWidth; j++){                                            //Change f to flag image
        row.push(<td key={'' + i + j} >
                      <button onClick={() => this.handleClick(i,j)}
                              onMouseDown={() => this.changeSmile('😮')}
                              onMouseUp={() => this.changeSmile('🙂')}
                              onContextMenu={(event) => this.handlePlaceFlag(i,j,event)}
                              className={tempArr[i][j].opened ? this.setStyleForNumbers(tempArr[i][j].val) : 'closed-cell'}>
                        {tempArr[i][j].opened
                          ?
                        tempArr[i][j].val === 'b'
                          ?
                        <Icon image={bombIcon}/>
                          :
                        tempArr[i][j].val === 0
                          ?
                        ' '
                          :
                        tempArr[i][j].val
                          :
                        null}

                        {tempArr[i][j].flagPlaced
                          ?
                        tempArr[i][j].opened
                          ?
                        null
                          :
                        <Icon image={flagIcon} />
                          :
                        null}
                      </button>
                  </td>)
      }

      filledArrayForTable.push(<tr key={i}>{row}</tr>)
    }

    this.setState({
      fieldArray: filledArrayForTable
    })

  }

  componentDidMount(){
    this.setState({
      loose: false,
      win: false,
      openedCells: 0
    }, this.fillArray)
  }

  handleChangeSettings = (type, newSettings) => {
    if (type === 'save'){
      this.setState ({
        bombs: +newSettings.bombsAndFlags,
        flags: +newSettings.bombsAndFlags,
        fieldHeight: +newSettings.height,
        fieldWidth: +newSettings.width,
        showSettings: false
      }, this.restartGame)
    }else{
      this.setState ({
        showSettings: false
      })
    }
  }

  handleClearScore = (whichScore) => {
    this.setState({
      [whichScore]: [0, 0]
    })
    localStorage.removeItem('minesweeper' + whichScore[0].toUpperCase() + whichScore.slice(1))
  }

  render(){
    return(
      <div className='main-wrapper'>
        <div className="mainContainer">
          <div className='caption'>
            <span className='one leter'>M</span>
            <span className='two leter'>i</span>
            <span className='three leter'>n</span>
            <span className='four leter'>e</span>
            <span className='fife leter'>s</span>
            <span className='six leter'>w</span>
            <span className='seven leter'>e</span>
            <span className='eight leter'>e</span>
            <span className='one leter'>p</span>
            <span className='two leter'>e</span>
            <span className='three leter'>r</span>
          </div>
            <div className='controls'>
              <FlagCounter flagsLeft={this.state.flagsLeft}
                            colorForFlagsCounter={this.state.colorForFlagsCounter}/>
              <RestartButton restartGame={this.restartGame}
                             smile={this.state.smile}
                             plasement='app'/>
              <Timer elapsedTime={this.state.elapsedTime}/>
            </div>
          <Field fieldArray={this.state.fieldArray}

                changeSmile={this.changeSmile}
                smile={this.state.smile}
                renderTable={this.renderTable}
                placeBombs={this.placeBombs}
                bombsOnFieldNow={this.state.bombsOnFieldNow}
                countNumbersNearBombs={this.countNumbersNearBombs}/>

          <Statistics moves={this.state.moves}
            beginnerBest={this.state.beginnerBest}
            amateurBest={this.state.amateurBest}
            professionalBest={this.state.professionalBest}
            handleClearScore={this.handleClearScore}/>

          <button onClick={() => this.setState({showSettings:true})}
                  className="settings-button">
                  Settings
          </button>

        </div>

        {this.state.showSettings
          ?
        <Settings height={this.state.fieldHeight}
                  width={this.state.fieldWidth}
                  bombs={this.state.bombs}
                  handleChangeSettings={this.handleChangeSettings}/>
          :
        null
        }

        {this.state.win
          ?
        <WinOrLooseMessage type='win' restartGame={this.restartGame}/>
          :
        this.state.loose
          ?
        <WinOrLooseMessage type='loose' restartGame={this.restartGame}/>
          :
        null}

      </div>

    )
  }
}

export default App;
