const socket = io()
selectedChildElementsIndex = new Set()
const player_role_element = document.querySelector('#player_role')
const container = document.querySelector('#container')

// console.log(container.children)

// socket.on('clientInit',(selectedElements) => {
//     selectedChildElementsIndex = new Set(selectedElements)
//     renderCardSelections()
// })

socket.on('cardSelectionUpdate',(selectedElements) => {
    selectedChildElementsIndex = new Set(selectedElements)
    renderCardSelections()
})

socket.on('clientCountUpdate',(count) => {
    console.log(socket.id)
    clientCountElement = document.querySelector('#client_count')
    clientCountElement.innerHTML = `Connected Clients: ${count}`
})

socket.on('actorMessage',() => {
    alert('You are the Actor, You can select the cards.')
    player_role_element.innerHTML = 'Actor'
})

socket.on('guesserMessage',() => {
    alert('You are the guesser, you must guess the answer.')
    player_role_element.innerHTML = 'Guesser'
})

socket.on('waitMessage', () => {
    player_role_element.innerHTML = 'Please wait for more players to join...'
})

container.addEventListener('click',(e) => {

    clickedCardItem = e.target.closest(".card")
    
    if(clickedCardItem){
        // console.log('A card was clicked')
        cardItemIndex = [...clickedCardItem.parentNode.children].indexOf(clickedCardItem)
        socket.emit('cardClicked',cardItemIndex)
    }
})

function renderCardSelections(){
    containerChildren = document.querySelector('#container').children

    for (element of containerChildren){
        element.style.background = "white"
    }

    selectedChildElementsIndex.forEach(element => {
        containerChildren[element].style.background = "pink"
    });
}