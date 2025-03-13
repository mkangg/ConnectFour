// Sweet Alert instructions for game
Swal.fire({
    title: "Welcome!",
    text: "Click on the red chips at the top to place your move.",
    confirmButtonText: "START",
});
// setting all 42 chips for game
var chips = "";
for (let i = 1; i <= 42; i++) {
    chips += "<div class='emptyCoin' id='chip" + i + "'></div>";
}
document.getElementById("boardId").innerHTML = chips;

// initializing 2d array that represents game board
var board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];

// boolean check to see if someone won
var gameStatus = true;

/**
 * Places token in given column at the next valid row and updates html and 2d array. 
 * @param {int} column 
 * @param {string} color 
 * @param {int} player 1- for player; 2- for agent
 * @returns row that the token was placed in 
 */
function placeToken(column, color, player) {
    // find the next available row in that column
    for (let i = 5; i >= 0; i--) {
        if (board[i][column] == 0) {
            // update board and html
            board[i][column] = player;
            document.getElementById(
                "chip" + (7 * i + column + 1)
            ).style.backgroundColor = color;
            return i;
        }
    }
}

/**
 * Called when chips are clicked on html page.
 * Chips are placed according to user input. 
 * @param {int} column 
 */
function playerToken(column) {
    // placing token and checking if player won
    let row = placeToken(column, "red", 1);
    checkWin(row, column, 1);
    // if the player did not win, call agent to place token
    if (gameStatus) {
        agentToken();
    }
}

/**
 * Called after user places their chip. 
 * Uses an adapted MiniMax algorithm to calculate where to place chip. 
 */
function agentToken() {
    // initializing variables used to store rows and columns
    var column = 0;
    var row = 0;
    // creating a list of valid columns where chip can be placed (not full)
    var validCol = [];
    // make buttons non interactive while agent places token
    for (let i = 0; i < 7; i++) {
        document.getElementById("col" + i).disabled = true;
        if (board[0][i] == 0) {
            validCol.push(i);
        }
    }
    // creating an array to store column, value, and row of column
    var maxVal = [0, -4, 0];
    var minVal = [0, 4, 0];
    // for each valid column, calculate the max and min values
    for (let i = 0; i < validCol.length; i++) {
        var curRow = -1;
        var curCol = -1;
        curCol = validCol[i];
        for (let j = 5; j >= 0; j--) {
            if (board[j][curCol] == 0) {
                curRow = j;
                break;
            }
        }
        // store agent's max values in vals 0-3 and player's min values in vals 4-7
        var vals = [];
        vals[0] = horizontalValue(curRow, curCol, 2);
        vals[1] = verticalValue(curRow, curCol, 2);
        vals[2] = diagonalNEValue(curRow, curCol, 2);
        vals[3] = diagonalNWValue(curRow, curCol, 2);
        vals[4] = horizontalValue(curRow, curCol, 1);
        vals[5] = verticalValue(curRow, curCol, 1);
        vals[6] = diagonalNEValue(curRow, curCol, 1);
        vals[7] = diagonalNWValue(curRow, curCol, 1);
        // check if this column's max values are greater than current max value 
        for (let k = 0; k < 4; k++) {
            if (maxVal[1] <= vals[k]) {
                maxVal[0] = curCol;
                maxVal[1] = vals[k];
                maxVal[2] = curRow;
            }
        }
        // check if this column's min values are smaller than current min value
        for (let k = 4; k < 8; k++) {
            if (minVal[1] >= vals[k]) {
                minVal[0] = curCol;
                minVal[1] = vals[k];
                minVal[2] = curRow;
            }
        }
    }
    // if there is a winning move, place winning move
    if (maxVal[1] > 3) {
        row = placeToken(maxVal[0], "#FFD300", 2);
        column = maxVal[0];
        // if there is a winning move for player, block them
    } else if (minVal[1] < -3) {
        row = placeToken(minVal[0], "#FFD300", 2);
        column = minVal[0];
        // no winning moves, place next best move
    } else {
        row = placeToken(maxVal[0], "#FFD300", 2);
        column = maxVal[0];
    }
    // make buttons interactive again
    for (let i = 0; i < 7; i++) {
        document.getElementById("col" + i).disabled = false;
    }
    // check if anyone won
    checkWin(row, column, 2);
}

/**
 * Calculate and return how many tokens of given player are in a row horizontally
 * @param {int} row 
 * @param {int} col 
 * @param {int} player 1- for player; 2- for agent
 * @returns value of move, positive for agent, negative for player
 */
function horizontalValue(row, col, player) {
    // booleans to determine if left and right are empty
    let leftBlank = false;
    let rightBlank = false;
    // there is at least one in a row
    let val = 1;
    // splitting board in half and checking right side first
    for (let i = 1; i < 4; i++) {
        if (col + i < 7) {
            // add one to value if same color token
            if (board[row][col + i] == player) {
                val++;
                // if right side is empty and there is a token under the empty space
            } else if (
                board[row][col + i] == 0 &&
                (row == 5 || board[row + 1][col + i] != 0)
            ) {
                rightBlank = true;
                break;
            } else {
                break;
            }
        } else {
            break;
        }
    }
    // checking left side
    for (let i = 1; i < 4; i++) {
        if (col - i >= 0) {
            // add one to value if same color token
            if (board[row][col - i] == player) {
                val++;
                // if left side is empty and there is a token under the empty space
            } else if (
                board[row][col - i] == 0 &&
                (row == 5 || board[row + 1][col - i] != 0)
            ) {
                leftBlank = true;
                break;
            } else {
                break;
            }
        } else {
            break;
        }
    }
    // increasing priority if there is already two in a row with empty left and right spaces
    if (leftBlank && rightBlank && val >= 2) {
        val = 3.5;
    }
    if (player == 2) {
        return val;
    }
    // negating value if player and not agent
    return -val;
}

/**
 * Calculate and return how many tokens of given player are in a row vertically
 * @param {int} row 
 * @param {int} col 
 * @param {int} player 1- for player; 2- for agent
 * @returns value of move, positive for agent, negative for player
 */
function verticalValue(row, col, player) {
    // there is at least one in a row
    let val = 1;
    // checking how many are in row under current space
    for (let i = 1; i < 4; i++) {
        if (row + i < 6) {
            if (board[row + i][col] == player) {
                val++;
            }
        } else {
            break;
        }
    }
    // move is not worth it if less than 3 spaces remaining with no tokens in a row
    if (
        player == 2 &&
        ((row == 2 && val <= 1) ||
            (row == 1 && val <= 2) ||
            (row == 0 && val <= 3))
    ) {
        return 0;
    }
    if (player == 2) {
        return val;
    }
    // negating value if player and not agent
    return -val;
}

/**
 * Calculate and return how many tokens of given player are in a row in the NW and SE diagonal direction
 * @param {int} row 
 * @param {int} col 
 * @param {int} player 1- for player; 2- for agent
 * @returns value of move, positive for agent, negative for player
 */
function diagonalNWValue(row, col, player) {
    // there is at least one in a row
    let val = 1;
    // checking SE direction first
    for (let i = 1; i < 4; i++) {
        if (row + i >= 6) {
            break;
        }
        if (board[row + i][col + i] == player) {
            val++;
        } else {
            break;
        }
    }
    // checking NW direction next
    for (let i = 1; i < 4; i++) {
        if (row - i < 0 || col - i < 0) {
            break;
        }
        if (board[row - i][col - i] == player) {
            val++;
        } else {
            break;
        }
    }
    if (player == 2) {
        return val;
    }
    // negating value if player and not agent
    return -val;
}

/**
 * Calculate and return how many tokens of given player are in a row in the NE and SW diagonal direction
 * @param {int} row 
 * @param {int} col 
 * @param {int} player 1- for player; 2- for agent
 * @returns value of move, positive for agent, negative for player
 */
function diagonalNEValue(row, col, player) {
    // there is at least one in a row
    let val = 1;
    // checking NE direction first
    for (let i = 1; i < 4; i++) {
        if (row - i < 0 || col + i >= 7) {
            break;
        }
        if (board[row - i][col + i] == player) {
            val++;
        } else {
            break;
        }
    }
    // checking SW direction next
    for (let i = 1; i < 4; i++) {
        if (row + i >= 6 || col - i < 0) {
            break;
        }
        if (board[row + i][col - i] == player) {
            val++;
        } else {
            break;
        }
    }
    if (player == 2) {
        return val;
    }
    // negating value if player and not agent
    return -val;
}

/**
 * Helper function that checks if anyone has won 
 * @param {int} row 
 * @param {int} column 
 * @param {int} player 1- for player; 2- for agent
 */
function checkWin(row, column, player) {
    // checking all values
    let vertVal = verticalValue(row, column, player);
    let horiVal = horizontalValue(row, column, player);
    let neVal = diagonalNEValue(row, column, player);
    let nwVal = diagonalNWValue(row, column, player);
    // if any values are equal to or greater than 4, end game
    if (
        Math.abs(vertVal) >= 4 ||
        Math.abs(horiVal) >= 4 ||
        Math.abs(neVal) >= 4 ||
        Math.abs(nwVal) >= 4
    ) {
        gameOver(player);
    }
}

/**
 * Ending game with announcement of who won
 * @param {int} player 1- for player; 2- for agent
 */
function gameOver(player) {
    // changing status of game to not allow any more moves
    gameStatus = false;
    // making buttons non interactive
    for (let i = 0; i < 7; i++) {
        document.getElementById("col" + i).disabled = true;
    }
    // if player won, congratulate them
    if (player == 1) {
        setTimeout(function () {
            Swal.fire({
                title: "Congrats!",
                text: "You won!",
                confirmButtonText: "OK",
            });
        }, 250);
        // if agent won, tell player good try
    } else {
        setTimeout(function () {
            Swal.fire({
                title: "Good try!",
                text: "Minji's robot won!",
                confirmButtonText: "OK",
            });
        }, 250);
    }
}