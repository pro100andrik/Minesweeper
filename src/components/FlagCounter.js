import './FlagCounter.css';

const FlagCounter = props => {
  return (
    <div className='flag-counter' style={props.colorForFlagsCounter}> {props.flagsLeft} </div>
  )
}
export default FlagCounter
