import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../components/Card';
import Anchor from '../../components/Anchor';
import { useGameState, waitingTimes, defaultPlayTime } from '../../hooks/useGameState';
import s from './Game.module.scss';
import Default from '../../layouts/Default';
import Timer from '../../components/Timer';
import { ReactComponent as HeaderLogo } from '../../assets/svgs/hand-logo-small.svg';
import AlertModal from '../../components/AlertModal';

const propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  user: PropTypes.shape({
    difficulty: PropTypes.string.isRequired,
  }).isRequired,
};

const Game = ({ match, user }) => {
  const {
    numOfCards,
    cards,
    allOpen,
    flipCard,
    lock,
    score,
    attempts,
    isModalOpen,
    playing,
    play,
    stop,
    timeTaken,
    scoreToWin,
  } = useGameState(user.difficulty);

  return (
    <Default>
      <div className={s.game}>
        <div className={s.header}>
          <ul className={s.leftHeader}>
            <li>
              <HeaderLogo />
            </li>
            {playing === 1 && <li>{`Attempts: ${attempts}`}</li>}
            {playing === 1 && <li>{`Score: ${score}`}</li>}
            {playing !== 0 && timeTaken === 0 && (
              <li>
                <Timer
                  onTimeout={stop}
                  playing={playing}
                  score={score}
                  defaultPlayTime={defaultPlayTime}
                />
              </li>
            )}
          </ul>
          <ul className={s.rightHeader}>
            {playing !== 0 && (
              <li>
                <Anchor size="md" color="success" to="#" onClick={play}>
                  Restart
                </Anchor>
              </li>
            )}
            <li>
              <Anchor size="sm" color="danger" to="/logout">
                Exit
              </Anchor>
            </li>
            <li className={s.username}>{`User: ${match.params.username}`}</li>
          </ul>
        </div>
        <div
          className={s.gameBoard}
          style={{ gridTemplateColumns: `repeat(${numOfCards / 2}, 0fr)` }}
        >
          {cards.map((card, i) => (
            <Card
              // eslint-disable-next-line react/no-array-index-key
              key={`${card.text}${i}`}
              text={card.text}
              open={allOpen || card.open}
              onClick={flipCard}
              index={i}
              lock={lock}
              notMatched={card.notMatched}
              matched={card.matched}
            />
          ))}
        </div>
        <AlertModal
          isOpen={isModalOpen && playing === 0}
          username={match.params.username}
          desc1={`Let’s start the GAMIFY. You will get ${numOfCards} cards open for ${
            waitingTimes[user.difficulty]
          } seconds and will turn
            back. You will have to match the cards in ${defaultPlayTime} seconds.`}
          btnLabel="Play Game"
          btnOnClick={play}
        />
        <AlertModal
          isOpen={playing === 2 && score !== scoreToWin}
          username={match.params.username}
          title="Ohhhh no, times up!!!"
          desc1="Your time of 60 seconds is over for the game. Please try again to click on below button."
          desc2={`Attempt: ${attempts} Score: ${score} time: ${defaultPlayTime}s`}
          btnLabel="Retake The Game"
          btnOnClick={play}
        />
        <AlertModal
          isOpen={playing === 2 && score === scoreToWin}
          username={match.params.username}
          title="Congratulations, You’re a Pro."
          desc1="You have completed the game within…"
          desc2={` Attempt: ${attempts} Score: ${score} Time: ${timeTaken}s`}
          btnLabel="Retake The Game"
          btnOnClick={play}
        />
      </div>
    </Default>
  );
};

Game.propTypes = propTypes;
export default Game;
