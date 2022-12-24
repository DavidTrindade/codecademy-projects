// All code should be written in this file.
let playerOneMoveOneType = undefined, playerOneMoveOneValue = undefined;
let playerOneMoveTwoType = undefined, playerOneMoveTwoValue = undefined;
let playerOneMoveThreeType = undefined, playerOneMoveThreeValue = undefined;

let playerTwoMoveOneType = undefined, playerTwoMoveOneValue = undefined;
let playerTwoMoveTwoType = undefined, playerTwoMoveTwoValue = undefined;
let playerTwoMoveThreeType = undefined, playerTwoMoveThreeValue = undefined;

const validMoveTypes = ['rock', 'paper', 'scissors'];

const setPlayerMoves = (player, moveOneType, moveOneValue, moveTwoType, moveTwoValue, moveThreeType, moveThreeValue) => {
    if (!moveOneType || !moveTwoType || !moveThreeType) {
        return new Error('Move type is missing');
    }

    if (!moveOneValue || !moveTwoValue || !moveThreeValue) {
        return new Error('Move value is missing');
    }

    if (!validMoveTypes.includes(moveOneType) || !validMoveTypes.includes(moveTwoType) || !validMoveTypes.includes(moveThreeType)) {
        return new Error('Move type must be rock, paper or scissors')
    }

    if (moveOneValue < 1 || moveTwoValue < 1 || moveThreeValue < 1) {
        return new Error('Move values must be one or greater');
    }

    if (moveOneValue > 99 || moveTwoValue > 99 || moveThreeValue > 99) {
        return new Error('Move values must be 99 or less');
    }

    if ((moveOneValue + moveTwoValue + moveThreeValue) > 99) {
        return new Error('Move values must sum to 99 or less');
    }


    switch (player) {
        case 'Player One':
            playerOneMoveOneType = moveOneType;
            playerOneMoveTwoType = moveTwoType;
            playerOneMoveThreeType = moveThreeType;
            playerOneMoveOneValue = moveOneValue;
            playerOneMoveTwoValue = moveTwoValue;
            playerOneMoveThreeValue = moveThreeValue;
            break;
        case 'Player Two':
            playerTwoMoveOneType = moveOneType;
            playerTwoMoveTwoType = moveTwoType;
            playerTwoMoveThreeType = moveThreeType;
            playerTwoMoveOneValue = moveOneValue;
            playerTwoMoveTwoValue = moveTwoValue;
            playerTwoMoveThreeValue = moveThreeValue;
            break;
    }
}

const getRoundWinner = (round) => {
    if (![1, 2, 3].includes(round)) {
        return null;
    }

    if (round === 1 && (!playerOneMoveOneType || !playerTwoMoveOneType || !playerOneMoveOneValue || !playerTwoMoveOneValue))
        return null;

    if (round === 2 && (!playerOneMoveTwoType || !playerTwoMoveTwoType || !playerOneMoveTwoValue || !playerTwoMoveTwoValue))
        return null;

    if (round === 3 && (!playerOneMoveThreeType || !playerTwoMoveThreeType || !playerOneMoveThreeValue || !playerTwoMoveThreeValue))
        return null;


    switch (round) {
        case 1:
            if (playerOneMoveOneType !== playerTwoMoveOneType)
                return getTypeWinner(playerOneMoveOneType, playerTwoMoveOneType);
            if (playerOneMoveOneValue > playerTwoMoveOneValue)
                return 'Player One';
            if (playerOneMoveOneValue < playerTwoMoveOneValue)
                return 'Player Two';
            return 'Tie';
        case 2:
            if (playerOneMoveTwoType !== playerTwoMoveTwoType)
                return getTypeWinner(playerOneMoveTwoType, playerTwoMoveTwoType);
            if (playerOneMoveTwoValue > playerTwoMoveTwoValue)
                return 'Player One';
            if (playerOneMoveTwoValue < playerTwoMoveTwoValue)
                return 'Player Two';
            return 'Tie';
        case 3:
            if (playerOneMoveThreeType !== playerTwoMoveThreeType)
                return getTypeWinner(playerOneMoveThreeType, playerTwoMoveThreeType);
            if (playerOneMoveThreeValue > playerTwoMoveThreeValue)
                return 'Player One';
            if (playerOneMoveThreeValue < playerTwoMoveThreeValue)
                return 'Player Two';
            return 'Tie';
    }
}

const getTypeWinner = (playerOneType, playerTwoType) => {
    switch (playerOneType) {
        case 'rock':
            return (playerTwoType === 'scissors') ? 'Player One' : 'Player Two'
        case 'paper':
            return (playerTwoType === 'rock') ? 'Player One' : 'Player Two'
        case 'scissors':
            return (playerTwoType === 'paper') ? 'Player One' : 'Player Two'
    }
}

const getGameWinner = () => {
    const roundWinners = [1, 2, 3].map(e => getRoundWinner(e));

    let playerOneWins = 0, playerTwoWins = 0;

    for (winner of roundWinners) {

        if (!winner)
            return null;

        if (winner === 'Player One')
            playerOneWins++;
        
        if (winner === 'Player Two')
            playerTwoWins++;
    }

    if (playerOneWins > playerTwoWins)
        return 'Player One';
    if (playerOneWins < playerTwoWins)
        return 'Player Two';
    return 'Tie';
}

const setComputerMoves = () => {
    [playerTwoMoveOneType, playerTwoMoveTwoType, playerTwoMoveThreeType] = Array.from({length: 3}, () => validMoveTypes[Math.floor(Math.random() * 3)]);
    
    const valueOne = Math.floor(Math.random() * 96) + 1;
    const valueTwo = Math.floor(Math.random() * (97 - valueOne)) + 1;

    const values = [valueOne, valueTwo, 99 - valueOne - valueTwo]
    shuffle(values);
    [playerTwoMoveOneValue, playerTwoMoveTwoValue, playerTwoMoveThreeValue] = values;
}

const shuffle = (arr) => {
    let i = arr.length;
    while (i > 0) {
        const j = Math.floor(Math.random() * i);
        i--;

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}