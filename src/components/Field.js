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
    )
  }
}

export default Field
