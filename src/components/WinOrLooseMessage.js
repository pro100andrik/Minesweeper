import './WinOrLooseMessage.css';
import RestartButton from './RestartButton';

const looseMessage = <div className='win-or-loose-text'>
  Sorry, but you loose =( <br/>
  Try again!
</div>

const winMessage = <div className='win-or-loose-text'>
  Congratulation! <br/>
  You win! :D
</div>

const WinOrLooseMessage = props => {
  return (
    <div className='wrapper'>
      <div className={props.type === 'loose' ? 'message-container loose' : 'message-container win'}>
        <div className='win-or-loose-message'> {props.type === 'loose' ? looseMessage : winMessage}</div>
        <div className='restart-button-container'> <RestartButton restartGame={props.restartGame}/> </div>
      </div>
    </div>
  )
}

export default WinOrLooseMessage
