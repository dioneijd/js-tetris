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
            id: '',
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

        const index = Math.floor(Math.random() * partTypes.length)
        const nextPart = partTypes[index]

        nextPart.position = {
            x: Math.floor(Math.random() * screen.width),
            y: -1
        }

        state.newPart = nextPart


        // state.newPart = {
        //     id: 'point',
        //     pieces: [
        //         {dx:0, dy:0}
        //     ],
        //     position: {
        //         x: 0,
        //         y: 0
        //     }
        // }

    }

    

    function start(){
        if (!state.started){
            state.started = true
            state.paused = false

            addPart()
    
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
                if(!state.mountedParts.find(mp => mp.y == state.newPart.position.y && mp.x == state.newPart.position.x + 1)){
                    state.newPart.position.x = Math.min(state.newPart.position.x + 1, screen.width - 1)
                }
            },
            ArrowLeft(){ 
                if(!state.mountedParts.find(mp => mp.y == state.newPart.position.y && mp.x == state.newPart.position.x - 1)){                    
                    state.newPart.position.x = Math.max(state.newPart.position.x - 1, 0)
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
        console.log(state)
        
        if (checkCollition()){            
            console.log(state.newPart)       
            state.mountedParts.push(state.newPart)
            //console.log(state.mountedParts)
            addPart()

        } else {            
            state.newPart.position.y += 1
        }
        
    }


    function checkCollition(){
        
        const touchedGnd = state.newPart.pieces.find(piece => state.newPart.position.y + piece.dy + 1 == screen.height)

        if (touchedGnd) {
            return true
        }

        const otherPart = state.mountedParts.find(mountedPart => mountedPart.y == state.part.y + 1 && mountedPart.x == state.part.x
        )

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
        //console.log(`Notifying ${state.observers.length} observers`)

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
    const newPart = game.state.newPart
    
    if (newPart.pieces){
        newPart.pieces.forEach((delta) => {
            context.fillStyle = 'black'
            context.fillRect(newPart.position.x + delta.dx, newPart.position.y + delta.dy, 1, 1)
        })
    }

    game.state.mountedParts.forEach((part) => {        
        part.pieces.forEach(piece => {
            context.fillStyle = 'gray'
            context.fillRect(part.position.x + piece.dx, part.position.y + piece.dy, 1, 1)

        })
    })
    
    requestAnimationFrame(renderScreen)

}