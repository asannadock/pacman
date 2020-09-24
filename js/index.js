const width = 21;
const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const gameStatusDisplay = document.querySelector('#gameStatus')
score = 0
let squares =[];

  // layout 21 * 21 = 441
  // 0 - pac-dots
  // 1 - wall
  // 2 - ghost-lair
  // 3 - power-pellet
  // 4 - empty
  const layout = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,
    1,3,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,3,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,
    1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,
    1,1,1,1,1,0,1,1,1,4,1,4,1,1,1,0,1,1,1,1,1,
    4,4,4,4,1,0,1,4,4,4,4,4,4,4,1,0,1,4,4,4,4,
    1,1,1,1,1,0,1,4,1,1,2,1,1,4,1,0,1,1,1,1,1,
    4,4,4,4,4,0,4,4,1,2,2,2,1,4,4,0,4,4,4,4,4,
    1,1,1,1,1,0,1,4,1,2,2,2,1,4,1,0,1,1,1,1,1,
    4,4,4,4,1,0,1,4,1,2,2,2,1,4,1,0,1,4,4,4,4,
    1,1,1,1,1,0,1,4,1,1,1,1,1,4,1,0,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,
    1,3,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,3,1,
    1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,
    1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,
    1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
]

// create board
function createBoard() {
    for( let i = 0; i < layout.length; i++ ) {
        // create square
        const square = document.createElement('div');
        // put square in grid
        grid.appendChild(square);
        // put square in squares array, that was declaired on the very top 
        squares.push(square);

        // render each square of the board corresponding to the layout - add correspondent classname to each square
        if (layout[i] === 0) {
            squares[i].classList.add('pac-dot');
        } else if (layout[i] === 1) {
            squares[i].classList.add('wall');
        } else if (layout[i] === 2) {
            squares[i].classList.add('ghost-lair');
        } else if (layout[i] === 3) {
            squares[i].classList.add('power-pellet');
        } else if (layout[i] === 4) {
            squares[i].classList.add('empty');
        }
    }
}
createBoard();

//starting position of pacman 
let pacmanCurrentIndex = 325
squares[pacmanCurrentIndex].classList.add('pacman')

// move pacman with keys using keycodes & rorate pacman pointing it to the right direction
// up - 38
// left - 37
// right - 39
// down - 40

const directions = [
    { code: 37, movement: -1,     rotateTo: 'd-left'  },
    { code: 38, movement: -width, rotateTo: 'd-up'    },
    { code: 39, movement: 1,      rotateTo: 'd-right' },
    { code: 40, movement: width,  rotateTo: 'd-down'  }
]

const isWall = (direction) => squares[pacmanCurrentIndex + direction].classList.contains('wall')
const isGhostLair = (direction) => squares[pacmanCurrentIndex + direction].classList.contains('ghost-lair')

function movePacmanByKey(e) {
    squares[pacmanCurrentIndex].classList.remove('pacman','d-down','d-left','d-right','d-up')
    for ( let i = 0; i < directions.length; i++ ) {
        if(e.keyCode === directions[i].code) {
            if ( !isWall(directions[i].movement) && !isGhostLair(directions[i].movement) ) {
                pacmanCurrentIndex += directions[i].movement
            }
            squares[pacmanCurrentIndex].classList.add('pacman', directions[i].rotateTo)
        }
    }
    eatPacDot()
    eatPowerPellet()
}
document.addEventListener('keyup', movePacmanByKey)

// pacman eats pacdots
function eatPacDot() {
    if ( squares[pacmanCurrentIndex].classList.contains('pac-dot') ) {
        squares[pacmanCurrentIndex].classList.remove('pac-dot')
        score++
        scoreDisplay.textContent = score
    }
}

// pacman eats power-pellet
function eatPowerPellet() {
    //if square pacman is in contains a power pellet
    if ( squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
        // removing 'power-pellet' class from square
        squares[pacmanCurrentIndex].classList.remove('power-pellet')
        //add a score of 10
        score +=10
        scoreDisplay.textContent = score
        //change each of the four ghosts to isScared
        scareGhosts()
        //use setTimeout to unscare ghosts after 10 seconds
        setTimeout(unScareGhosts, 10000)
    }
}

// create ghosts by declairing an array of ghosts
let ghosts = [
    { name: 'blinky', className: 'blinky', startIndex: 220, speed: 200, isScared: false, intervalID: NaN, currentIndex: 220 },
    { name: 'pinky', className: 'pinky', startIndex: 240, speed: 250, isScared: false, intervalID: NaN, currentIndex: 240 },
    { name: 'inky', className: 'inky', startIndex: 241, speed: 300, isScared: false, intervalID: NaN, currentIndex: 241 },
    { name: 'clyde', className: 'clyde', startIndex: 242, speed: 350, isScared: false, intervalID: NaN, currentIndex: 242 },
]

// draw ghosts on the grid by setting className to each ghost
function drawGhosts() {
    for ( let ghost of ghosts ) {
        // set className for each ghost and 'ghost' class to all ghosts to use it later for targeting them all at once and not one by one
        squares[ghost.startIndex].classList.add(ghost.className, 'ghost')
    }
}
drawGhosts()

// scare ghost
function scareGhosts() {
    ghosts.forEach( ghost => ghost.isScared = true )
}

// unscare ghost
function unScareGhosts() {
    ghosts.forEach( ghost => ghost.isScared = false )
}

// move ghosts
function moveGhost() {
    // set random direction for each ghost
    let randomDirection = directions[ Math.floor( Math.random() * directions.length ) ].movement

    // make ghosts moving with the speed set for each of them using setInterval method
    for ( let ghost of ghosts ) {
        ghost.intervalID = setInterval(function() {
            // check if the next square does NOT contain a wall and does NOT contain a ghost
            if( !squares[ghost.currentIndex + randomDirection].classList.contains('wall') && 
            !squares[ghost.currentIndex + randomDirection].classList.contains('ghost') ) {
                // remove ghost from the cuttent position
                squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost', 'scared-ghost')
                // add direction to current Index
                ghost.currentIndex += randomDirection
                // readd ghost class
                squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
            } // otherwise set a new direction 
            else {
                randomDirection = directions[ Math.floor( Math.random() * directions.length ) ].movement
            }

            // define scared ghosts
            if (ghost.isScared) {
                squares[ghost.currentIndex].classList.add('scared-ghost')
            }

            // pacman eats ghosts
            if ( ghost.isScared && squares[ghost.currentIndex].classList.contains('pacman') ) {
                // remove classes from the square
                squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost', 'scared-ghost')
                // add a score of 100
                score += 100
                scoreDisplay.textContent = score
                // move ghost to its starting position and re-add classNames
                ghost.currentIndex = ghost.startIndex
                squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
            } else if ( !ghost.isScared && ( squares[pacmanCurrentIndex].classList.contains('ghost') || squares[ghost.currentIndex].classList.contains('pacman') ) ) {
                gameOver()
            }

        }, ghost.speed)
    }
}
moveGhost()

// game over
function gameOver() {
    // stop ghosts moving using clearInterval
    ghosts.forEach( ghost => clearInterval(ghost.intervalID) )
    // remove eventlistener from moving pacman function
    document.removeEventListener('keyup', movePacmanByKey)
    // declairing game over
    gameStatusDisplay.style.display = 'inline-block'
    gameStatusDisplay.textContent = 'Game Over!'
}
