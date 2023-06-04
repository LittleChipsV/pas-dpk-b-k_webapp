class Tictactoe{
    constructor(selector){
        this.parentElement = document.querySelector(selector);
        this.playerList = ['x','o'];
        this.gameBoard = Array(9).fill('');
        this.currentPlayer = 0;
        this.isTie;
        this.didWin = false;
        this.buildGameUI();
    }

    getPlayerLabel(){
        return this.playerList[this.currentPlayer];
    }

    buildCardPlayer(playerName, playerNumber){
        return `<div class="box-player">
                    <p class="player-label ${playerName}">
                        ${playerName}
                    </p>
                    <p id="player${playerNumber}" class="player-name">
                        Player ${playerNumber}
                    </p>
                    <p class="turn">Giliranmu</p>
                </div>`
    }

    buildGameUI(){
        const gameInfoEl = document.createElement('div')
        gameInfoEl.className = 'game-info';

        let playerCards='';
        this.playerList.forEach((player,i)=>{
            playerCards += this.buildCardPlayer(player,i+1)
        });

        gameInfoEl.innerHTML = playerCards;

        gameInfoEl.firstChild.classList.add('active');

        const gameControl = document.createElement('div');
        gameControl.className = 'game-control';

        const btnReset = document.createElement('button');
        btnReset.className = 'btn btn-reset';
        btnReset.innerText = 'Restart';
        btnReset.addEventListener('click',() => this.gameReset());

        gameControl.appendChild(btnReset);
        gameInfoEl.appendChild(gameControl);

        const gamePlayEl = document.createElement('div');
        gamePlayEl.className = 'game-play';

        for(let i = 0; i < 9; i++){
            const btn = document.createElement('button')
            btn.className = 'btn-tictactoe';
            btn.addEventListener('click',(e)=>this.onCellClick(e,i))
            gamePlayEl.appendChild(btn);
        }

        this.parentElement.append(gameInfoEl,gamePlayEl);
        this.gamePlayEl = gamePlayEl;
    }

    onCellClick(e,i){
        const btn = e.target;
        btn.innerText = this.getPlayerLabel();
        btn.classList.add(btn.innerText);
        btn.disabled = true;
        this.gameBoard[i] = btn.innerText;

        this.checkWin();
        this.switchPlayer();
    }

    switchPlayer(currentPlayer=undefined){
        if(currentPlayer != undefined){
            this.currentPlayer = currentPlayer;
        }else{
            this.currentPlayer = this.currentPlayer == 1 ? 0 : 1;
        }
        const boxplayers = document.querySelectorAll('.box-player');
        boxplayers.forEach((box,i)=>{
            if(this.isTie){
                return;
            }
            else if(!this.didWin){
                box.lastElementChild.textContent = "Giliranmu";
                if(this.currentPlayer==i){
                    box.classList.add('active');
                }else{
                    box.classList.remove('active');
                }
            }
            else{
                box.lastElementChild.textContent = "Menang!";
                document.querySelector('.box-player.active').classList.add('winner');
            }
        });
    }

    gameReset(){
        if(this.didWin){
            document.querySelector('.box-player.active.winner').classList.remove('winner');
            this.didWin = false;
        }

        this.isTie = false;
        document.querySelector('.turn').textContent = 'Giliranmu';
        this.gameBoard = Array(9).fill('');
        this.switchPlayer(0);

        for(const btn of this.gamePlayEl.children){
            btn.innerHTML = '';
            btn.classList.remove(...this.playerList);
            btn.disabled = false;
        }
    }

    checkWin(){
        const winConditions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],

            [0,3,6],
            [1,4,7],
            [2,5,8],

            [0,4,8],
            [2,4,6]
        ];

        for(let i = 0; i < winConditions.length; i++){
            const [a,b,c] = winConditions[i];
            
            if(this.getPlayerLabel()==this.gameBoard[a] && this.getPlayerLabel()==this.gameBoard[b] && this.getPlayerLabel()==this.gameBoard[c] && !this.isTie){
                this.didWin = true;
                this.switchPlayer();
               
                Swal.fire({
                    icon: 'info',
                    title: 'Pemenang:',
                    html: `Player ${this.currentPlayer == 1 ? 1 : 2}`.fontcolor(this.currentPlayer == 1 ? 'red' : 'fff000'),
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Oke',
                    denyButtonText: `Restart`,
                    customClass: {
                        confirmButton: 'd-c-button',
                        denyButton: 'd-c-button',
                    }
                  }).then((result) => {
                    for(const btn of this.gamePlayEl.children){
                        btn.disabled = true;
                    }
                    if (result.isDenied) {
                      Swal.fire('Game telah di-restart.', '', 'success');
                      this.gameReset();
                    }
                  })
            }
        }
        
        this.isTie = this.gameBoard.every((e)=>{ if(e == ''){
            return false;
            }
        return true;
        });

        if(this.isTie && !this.didWin)
        {
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
              this.gameReset();
            }
          })
        };
    }
}

