import './Timer.css';

function formatTime(time){
  return ('00' + time).slice(-3)
}

const Timer = props => {
  return (
    <div className='timer'> {formatTime(props.elapsedTime)} </div>
  )
}

export default Timer
