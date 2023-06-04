let players = ['Player 1', 'Player 2'];
let currPlayer = players[0];
let gameOver;
let didWin;
let isTie;
let board;

let rows = 6;
let columns = 7;
let currColumns = [];


window.onload = function() {
    setGame();
}

function setGame() { 
    board = [];
    currColumns = [5, 5, 5, 5, 5, 5, 5];

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push('');
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}

function setPiece() {
    if (gameOver) {
        return;
    }

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currColumns[c]; 

    if (r < 0) {
        return;
    }

    board[r][c] = currPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    
    const boxplayers = document.querySelectorAll('.box-player');
    

    if (currPlayer == players[0]) {
        tile.classList.add("red-piece");
        currPlayer = players[1];

    }
    else {
        tile.classList.add("yellow-piece");
        currPlayer = players[0];
    }
    
    r -= 1;
    currColumns[c] = r;

    checkWinner();
    turn();
}

function turn(){
    const boxplayers = document.querySelectorAll('.box-player');
    
        boxplayers.forEach((box,i)=>{
            if(isTie){
                return;
            }
            else if(!gameOver){
                box.lastElementChild.textContent = "Giliranmu";
                if(currPlayer==players[i]){
                    box.classList.add('active');
                }else{
                    box.classList.remove('active');
                }
            }
            else{
                box.lastElementChild.textContent = "Menang!";
                document.querySelector('.box-player.active').classList.add('winner');
                didWin = true;
            }
        });
}

function checkIfTie(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(board[r][c] == ''){
                return false;
            }
        }
    }
    return true;
}

function checkWinner() {

     // Horizontal
     for (let r = 0; r < rows; r++) {
         for (let c = 0; c < columns - 3; c++){
            if (board[r][c] != '') {
                if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
         }
    }

    // Vertical
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] != '') {
                if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // Anti-diagonal
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != '') {
                if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // Diagonal
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != '') {
                if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
    
    isTie = checkIfTie();
    
    if(isTie && !didWin){
        document.querySelector('.box-player.active').classList.remove('active');
        Swal.fire({
            icon: 'info',
            title: 'Permainan Seri',
            html: 'Tidak ada yang menang.',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Oke',
            denyButtonText: `Restart`,
            customClass: {
                confirmButton: 'd-c-button',
                denyButton: 'd-c-button',
            }
            }).then((result) => {
            if (result.isDenied) {
              Swal.fire('Game telah di-restart.', '', 'success');
              restart();
            }
        })
    }
}

function setWinner(r, c) {
    gameOver = true;
    turn();
    if (board[r][c] == players[0]) {
        currPlayer = players[0];
    } else {
        currPlayer = players[1];
    }
    Swal.fire({
        icon: 'info',
        title: 'Pemenang:',
        html: `${currPlayer.fontcolor(currPlayer == players[0] ? 'red' : 'fff000')}`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Oke',
        denyButtonText: `Restart`,
        customClass: {
            confirmButton: 'd-c-button',
            denyButton: 'd-c-button',
        }
      }).then((result) => {
        if (result.isDenied) {
          Swal.fire('Game telah di-restart.', '', 'success');
          restart();
        }
      })
}

function restart(){
    if(didWin){
        document.querySelector('.box-player.active.winner').classList.remove('winner');
        didWin = false;
    }
    isTie = false;
    currPlayer = players[0];
    gameOver = false;
    turn();
    const parentElement = document.getElementById('board');

    while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.lastChild);
    }
    setGame();
}
