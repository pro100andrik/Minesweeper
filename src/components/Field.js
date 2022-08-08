import React from 'react';
import './Field.css';

class Field extends React.Component{

  handleChangeSmile = () => {
    if (this.props.smile === '😮'){
      this.props.changeSmile('🙂')
    }

  }

  render(){

    return (
      <div className='field-div'>
        <table>
          <tbody onMouseLeave={() => this.handleChangeSmile()}>
            {this.props.fieldArray}
          </tbody>
         </table>

      </div>
      // <button onClick={this.props.renderTable}> render field </button>
      // <button onClick={this.props.placeBombs}> place bombs </button>
      // <button onClick={this.props.countNumbersNearBombs}> count bombs </button>
      // <div>bombs on field now {this.props.bombsOnFieldNow}</div>

    )
  }
}

export default Field
