
const Player = (sign) => {
    this.sign = sign;

    const getCurrentPlayer = () =>{
        return this.sign;
    }

    const switchPlayer = () => {
        if (this.sign == 'X'){
            sign = 'O';
        }
        else{
            sign = 'X';
        }
        this.sign = sign
        return this.sign;
    }

    return {getCurrentPlayer, switchPlayer};
}

//create 2D board
const gameBoard = (() => {
    let board = [];

    for (let i = 0; i < 3; i++){
        board[i] = []
        for (let j = 0; j < 3; j++){
            board[i].push("");
        }     
    }

    const getBoard = () => board;

    const setField = (r, c, sign) => {
        if (board[r][c] == ''){
            board[r][c] = sign;
        }

    };

    const reset = () => {
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                board[i][j] = '';
            }     
        }
    }

    return {getBoard, setField, reset};

})();


const checkEquals = (x, y, z) => {
    return x == y && y == z && x != '';
}

const checkWinner = (board) => {
    let winner = null;

    //horizontal 
    for (i = 0; i < 3; i++){
        if (checkEquals(board[i][0], board[i][1], board[i][2])){
            winner = board[i][0];
        }     
    }
    //vertical 
    for (i = 0; i < 3; i++){
        if (checkEquals(board[0][i], board[1][i], board[2][i])){
            winner = board[0][i];
        }    
    }
    //diagonal 
    if (checkEquals(board[0][0], board[1][1], board[2][2]) || checkEquals(board[0][2], board[1][1], board[2][0])){
        winner = board[1][1];
    }

    return winner;

}

const switchColor = (cell, sign, header) => {
    if (sign == 'X')
    {
        cell.style.color = '#E07A5F';
        header.style.color = '#69A387';
        
    }
    else{
        cell.style.color = '#69A387';
        header.style.color = '#E07A5F';
    }

}

const checkDraw = (board) => {
    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            if (board[i][j] == ''){
                return false
            }
        }
    }
    return true;
}

const gameController = (player, board) => {
    let endGame = false;
    let header = document.querySelector('.players-turn');
    const updateBoard = (row, col) => {
        gameBoard.setField(row, col, player.getCurrentPlayer());
    }
    const updateScreen = (row, col) => {
        let cell = document.querySelector('[data-row="'+ row +'"][data-col="'+ col +'"]')
        let currentPlayer = player.getCurrentPlayer();
        if (!cell.textContent){
            switchColor(cell, currentPlayer, header);
            cell.textContent = currentPlayer
            player.switchPlayer();
            header.textContent = `Player ${player.getCurrentPlayer()}'s turn`;
        }

    }
    const updateWinner = () => {
        let winner = checkWinner(board);
        if (winner){
            endGame = true;
            header.textContent = `Player ${winner} has won!`;

        }
        else if (checkDraw(board)){
            endGame = true;
            header.textContent = "It's a draw!";
        }
        else{
            endGame = false;
            }
    }
    
    const playRound = (row, col, cells) => {
        if (endGame) return;
        updateBoard(row, col);
        updateScreen(row, col);
        updateWinner();
        if (endGame){
            cells.forEach(cell => {
                cell.classList.remove('hover');
            });
            header.style.color = "#bad7df";
        };
    }

    const gameReset = () => {
        endGame = false;
        player = Player('X');
        header.textContent = "Player X's turn";
        header.style.color = "#E07A5F";
    }

    return {playRound, gameReset};

}

const screenController = (() => {
    const board = gameBoard.getBoard();
    const boardDiv = document.querySelector('.gameboard');
    const restart = document.querySelector('.restart');
    let player = Player('X');
    let game = gameController(player, board);

    //render board
    board.forEach((arr, row) => {
        arr.forEach((cell, col) => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add('cell');
            cellDiv.classList.add('hover');
            cellDiv.textContent = cell;
            cellDiv.dataset.row = row;
            cellDiv.dataset.col = col;
            boardDiv.appendChild(cellDiv);
        })
    })

    const restartGame = () => {
        gameBoard.reset();
        cells.forEach((cell) => {
            cell.textContent = '';
            cell.classList.add('hover');
        })
        game.gameReset();

    }

    const cells = Array.from(document.querySelectorAll('.cell'));
    
    const placeItem = (event) => {
        let cell = event.target;
        let row =  cell.getAttribute("data-row");
        let col =  cell.getAttribute("data-col");
        game.playRound(row, col, cells);
    }

    cells.forEach((cell) => {
        cell.addEventListener('click', placeItem);
        cell.player = player;

    })
    restart.addEventListener('click', restartGame);

})();
