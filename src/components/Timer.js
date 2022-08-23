import './Timer.css';

function formatTime(time){
  return ('00' + time).slice(-3)
}

const Timer = props => {
  return (
    <div className='timer'> {formatTime(Math.floor(props.elapsedTime / 1000))} </div>
  )
}

export default Timer
