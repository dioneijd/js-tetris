const screen = document.getElementById('screen')
const context = screen.getContext('2d')
const currentPlayer = 'player1'


const game = createGame()
const keyboardListener = createKeyboardListener()
keyboardListener.subscribe(game.movePart)




function createGame(){
    
    const state = {
        paused: false,
        started: false,
        speed: 200,
        interval: '',
        part: {
            x: 0,
            y: 0
        },
        newPart: {
            id: 'bar',
            pieces: [
                {dx:0, dy:0}
            ],
            position: {
                x: 0,
                y: 0
            }            
        },
        mountedParts: []
    }


    const partTypes = [
        {
            id: 'point',
            pieces: [
                {dx:0, dy:0}
            ]
        },
        {
            id: 'bar',
            pieces: [
                {dx:0, dy:0},
                {dx:1, dy:0},
                {dx:2, dy:0},
                {dx:3, dy:0}
            ]
        }
    ]


    function addPart(){
        // state.part = {
        //     x: 2,
        //     y: 0
        // }

        state.newPart = {
            id: 'bar',
            pieces: [
                {dx:0, dy:0}
            ],
            position: {
                x: 0,
                y: 0
            }
        }

    }

    

    function start(){
        if (!state.started){
            state.started = true
            state.paused = false
    
            state.interval = setInterval(movePartDown, state.speed)
        }
        
    }

    function pause(){
        state.paused = !state.paused
        if (state.paused) {
            clearInterval(state.interval)
        } else {
            state.interval = setInterval(movePartDown, state.speed)
        }
    }


    function movePart(command){
        const moveAccept = {
            ArrowRight(){
                if(!state.mountedParts.find(mp => mp.y == state.part.y && mp.x == state.part.x + 1)){
                    state.part.x = Math.min(state.part.x + 1, screen.width - 1)
                }
            },
            ArrowLeft(){ 
                if(!state.mountedParts.find(mp => mp.y == state.part.y && mp.x == state.part.x - 1)){                    
                    state.part.x = Math.max(state.part.x - 1, 0)
                }
            }
        }

        const keyPressed = command.keyPressed
        const moveFunction = moveAccept[keyPressed]

        if (state.part && moveFunction){
            moveFunction()
        }
    }

    function movePartDown(){
        
        if (checkCollition()){            
            state.mountedParts.push(state.part)
            addPart()

        } else {            
            state.part.y += 1
        }
        
    }


    function checkCollition(){
        
        if (screen.height == state.part.y + 1) {
            return true
        }

        const otherPart = state.mountedParts.find(mountedPart => {
            return mountedPart.y == state.part.y + 1 && mountedPart.x == state.part.x
        })

        if (otherPart) {return true}

        return false
        
    }


    return {
        state,
        addPart,
        movePart,
        start,
        pause,
        movePartDown
    }
    

}




function createKeyboardListener(){
    const state = {
        observers: []
    }

    function subscribe(observerFunction){
        state.observers.push(observerFunction)
    }

    function notifyAll(command){
        console.log(`Notifying ${state.observers.length} observers`)

        for (const observerFunction of state.observers){
            observerFunction(command)
        }
    }

    
    document.addEventListener('keydown', handleKeyDown)

    function handleKeyDown(event){
        const keyPressed = event.key

        const command = {
            keyPressed
        }

        notifyAll(command)
    }

    return {
        subscribe
    }



}





renderScreen()

function renderScreen(){

    context.clearRect(0, 0, screen.width, screen.height)


    // context.fillStyle = 'black'
    // context.fillRect(game.state.part.x, game.state.part.y, 1, 1)


    context.fillStyle = 'black'

    const newPart = game.state.newPart
    newPart.pieces.forEach((delta) => {
        context.fillRect(newPart.position.x + delta.dx, newPart.position.y + delta.dy, 1, 1)
    })



    game.state.mountedParts.forEach((part) => {
        context.fillStyle = 'gray'
        context.fillRect(part.x, part.y, 1, 1)

    })


    requestAnimationFrame(renderScreen)

}