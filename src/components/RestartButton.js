import './RestartButton.css';

const RestartButton = props => {
  return (
    <div className='restart-button'> <button onClick={props.restartGame}> {props.plasement === 'app' ? props.smile : 'restart'} </button>  </div>
  )
}

export default RestartButton
