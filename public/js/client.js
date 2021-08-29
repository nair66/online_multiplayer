const socket = io()
selectedChildElementsIndex = new Set()

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
    clientCountElement = document.querySelector('#client_count')
    clientCountElement.innerHTML = `Connected Clients: ${count}`
})

container.addEventListener('click',(e) => {

    clickedCardItem = e.target.closest(".card")
    
    if(clickedCardItem){
        console.log('A card was clicked')
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