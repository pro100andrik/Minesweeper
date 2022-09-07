import React from 'react';
import './Settings.css';
class Settings extends React.Component {
  constructor(props){
    super(props);
    this.state = ({
      height: this.props.height,
      width: this.props.width,
      bombsAndFlags: this.props.bombs,
      maxBombs: this.props.height * this.props.width
    })
  }
  handleChange = (type, value) => {
    if (value < 1){
      value = 1;
    }
    this.setState({
      [type]: value
    }, this.countMaxBombs)
  }
  countMaxBombs = () => {
    if (this.state.bombsAndFlags > this.state.height * this.state.width){
          this.setState({
        bombsAndFlags: this.state.height * this.state.width
      })
    }
    this.setState({
      maxBombs: this.state.height * this.state.width
    })
  }

  handleCloseOrSaveSettings = (type) => {
    this.props.handleChangeSettings(type, this.state)
  }

  handleChangePresset = (type) => {
    switch(type){
      case 'beginner':
        this.setState({
          height: 9,
          width: 9,
          bombsAndFlags: 10
        })
        break;
      case 'amateur':
        this.setState({
          height: 16,
          width: 16,
          bombsAndFlags: 40
        })
        break;
      case 'professional':
        this.setState({
          height: 16,
          width: 30,
          bombsAndFlags: 99
        })
        break;
      default: break;
    }
  }
  render(){
    return (
      <div className='settings'>
        <button className='close-settings-button'
                onClick={() =>this.handleCloseOrSaveSettings('close')}>
        X
        </button>
        <div className='settings-container'>

          <div className='pressets-container'>
            <button className='presset-beginner-button presset-button'
                    onClick={() =>this.handleChangePresset('beginner')}>
            Beginner
            </button>
            <button className='presset-amateur-button presset-button'
                    onClick={() =>this.handleChangePresset('amateur')}>
            Amateur
            </button>
            <button className='presset-professional-button presset-button'
                    onClick={() =>this.handleChangePresset('professional')}>
            Professional
            </button>
          </div>
          <div className='inputs-container'>
            <div> height of field: <input value={this.state.height}
                                          type='number'
                                          min='1'
                                          onChange={(e) => this.handleChange('height', e.target.value)}/>
            </div>
            <div> width of field: <input value={this.state.width}
                                          type='number'
                                          min='1'
                                          onChange={(e) => this.handleChange('width', e.target.value)}/>
            </div>
            <div> bombs on field: <input value={this.state.bombsAndFlags}
                                          type='number'
                                          min='1'
                                          max={this.state.maxBombs}
                                          onChange={(e) => this.handleChange('bombsAndFlags', e.target.value)}/>
            </div>
          </div>
          <button className='save-settings-button'
                  onClick={() =>this.handleCloseOrSaveSettings('save')}>
                    save
          </button>
        </div>
      </div>
    )
  }
}

export default Settings
