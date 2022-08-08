import './WinOrLooseMessage.css';
import RestartButton from './RestartButton';

const looseMessage = <div className='loose-background'>
  <div className='win-or-loose-text'>
    Sorry, but you loose =( <br/>
      Try again!
  </div>
</div>

const winMessage = <div className='win-background'>
  <div className='win-or-loose-text'>
    Congratulation! <br/>
    You win! :D
  </div>
</div>

const WinOrLooseMessage = props => {
  return (
    <>
      <div className='win-or-loose-container'> {props.type === 'loose' ? looseMessage : winMessage} </div>
      <div className='restart-button-container'> <RestartButton restartGame={props.restartGame}/> </div>
    </>
  )
}

export default WinOrLooseMessage
