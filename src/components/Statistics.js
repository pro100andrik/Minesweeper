import React from 'react';
import './Statistics.css';

class Statistics extends React.Component {
  constructor(props){
    super(props);
    this.state = ({
      showScores: false
    })
  }

  handleShowScores = () => {
    this.setState({
      showScores: !this.state.showScores
    })
  }

  render() {
    return(
      <div className='statistic-container'>
        <div className='moves'> Moves made: {this.props.moves} </div>
        <button className='statistic-button' onClick={this.handleShowScores}> {this.state.showScores ? 'Hide' : 'Show'} best scores </button>

        {this.state.showScores
          ?
        <div className='scores-container'>
          <div className='beginner-scores'> Beginner: <button className='clear-button' onClick={() => this.props.handleClearScore('beginnerBest')}>Clear</button> <br /> {this.props.beginnerBest[1] === 0 ? 'No scores yet' : `Time: ${this.props.beginnerBest[1] / 1000} Moves: ${this.props.beginnerBest[0]}`} </div>
          <div className='amateur-scores'> Amateur: <button className='clear-button' onClick={() => this.props.handleClearScore('amateurBest')}>Clear</button> <br /> {this.props.amateurBest[1] === 0 ? 'No scores yet' : `Time: ${this.props.amateurBest[1] / 1000} Moves: ${this.props.amateurBest[0]}`} </div>
          <div className='professional-scores'> Professional: <button className='clear-button' onClick={() => this.props.handleClearScore('professionalBest')}>Clear</button> <br /> {this.props.professionalBest[1] === 0 ? 'No scores yet' : `Time: ${this.props.professionalBest[1] / 1000} Moves: ${this.props.professionalBest[0]}`} </div>
        </div>
          :
          null
        }


      </div>
    )
  }
}

export default Statistics
