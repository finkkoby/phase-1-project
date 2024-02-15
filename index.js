document.addEventListener("DOMContentLoaded", init)

//Global Variables
const characters = document.querySelector('div#character-cards')
const select = document.querySelector('select#dropdown')
const infoDiv = document.querySelector('#more-info')
const homeBtn = document.querySelector('button#home')

//Add Event Listeners
select.addEventListener('change', (e) => searchMe(e))
homeBtn.addEventListener('click', () => postCharacters())

//Functions
function init(e) {
    postCharacters()
}
function postCharacters() {
    clear()
    getCharacters()
    .then(charArray => charArray.forEach(char => makeHomeCard(char)))
}
function makeHomeCard(character) {
    let card = document.createElement('div')
    card.className = 'character-card'
    let name = document.createElement('h3')
    name['id'] = character.id
    name['name'] = character.name
    name.className = 'character-name'
    name.style.color = colorMe(character)
    name.innerText = character.name
    characters.appendChild(card)
    card.appendChild(name)
    name.addEventListener('click', moreInfo)
    name.addEventListener('mouseover', hover)
    name.addEventListener('mouseout', offHover)
}
function makeHeaderCard(character) {
    let card = document.createElement('div')
    card.className = 'character-card'
    let name = document.createElement('h3')
    name['id'] = character.id
    name['name'] = character.name
    name.className = 'character-name hover-target'
    name.style.color = colorMe(character)
    name.innerText = addArrow(character.name)
    characters.appendChild(card)
    card.appendChild(name)
    
}
function moreInfoCard(character) {
    let card = document.createElement('div')
    card.className = 'info-card'
    infoDiv.appendChild(card)
    let pic = document.createElement('img')
    pic.src = character['image']

    let altNames = document.createElement('h3')
    altNames.innerText = 'Also known as...'

    let names = document.createElement('div')
    names.id = 'alt-names'

    let formalName = document.createElement('p')
    formalName.innerText = character['name']
    names.appendChild(formalName)

    character['alternate_names'].forEach(char => {
        let name = document.createElement('p')
        name.innerText = char
        names.appendChild(name);
    })
    
    let speciesTitle = document.createElement('h3')
    speciesTitle.innerText = `Species`
    let species = document.createElement('p')
    species.innerText = capital(character['species'])

    let genderTitle = document.createElement('h3')
    genderTitle.innerText = `Gender`
    let gender = document.createElement('p')
    gender.innerText = capital(character['gender'])

    let houseTitle = document.createElement('h3')
    houseTitle.innerText = `House`
    let house = document.createElement('p')
    if (character['house'] !== '') {
        house.innerText = capital(character['house'])
    } else {
        if (character['wizard']) {
            house.innerText = 'Unknown'
        } else {
        house.innerText = 'N/A'
        }
    }

    let dateOfBirthTitle = document.createElement('h3')
    dateOfBirthTitle.innerText = `Birthday`
    let dateOfBirth = document.createElement('p')
    if (character['dateOfBirth'] !== null) {
        dateOfBirth.innerText = character['dateOfBirth']
    } else {
        dateOfBirth.innerText = 'Unknown'
    }

    let wizardTitle = document.createElement('h3')
    wizardTitle.innerText = 'Wizard'
    let wizard = document.createElement('p')
    if (character['wizard']) {
        wizard.innerText = 'Yes'
    } else {
        wizard.innerText = 'No'
    }

    let ancestryTitle = document.createElement('h3')
    ancestryTitle.innerText = `Ancestry`
    let ancestry = document.createElement('p')
    if (character['ancestry'] !== '') {
        ancestry.innerText = capital(character['ancestry'])
    } else {
        ancestry.innerText = 'Unknown'
    }

    let wandTitle = document.createElement('h3')
    wandTitle.innerText = `Wand`
    let wand = document.createElement('p')
    let wandItems = Object.values(character['wand'])
    if (character['wizard']) {
        let trueItems = wandItems.filter(item => item !== '' && item !== null)
        if (trueItems.length > 0) {
            trueItems.forEach(item => {
                if (typeof(item) === 'number') {
                    wand.innerText += `${item} inches`
                } else {
                    wand.innerText += `${capital(item)} `
                }   
            })
        } else {
            wand.innerText += 'Unknown'
        }
    } else {
        wand.innerText += 'N/A'
    }

    let patronusTitle = document.createElement('h3')
    patronusTitle.innerText = `Patronus`
    let patronus = document.createElement('p')
    if (character['wizard']) {
        if (character['patronus'] !== '') {
            patronus.innerText = capital(character['patronus'])
        } else {
            patronus.innerText = 'Unknown'
        }
    } else {
        patronus.innerText = 'N/A'
    }

    let aliveTitle = document.createElement('h3')
    aliveTitle.innerText = 'Alive'
    let alive = document.createElement('p')
    if (character['alive']) {
        alive.innerText = 'Yes'
    } else {
        alive.innerText = 'No'
    }

    card.append(pic, altNames, names, speciesTitle, species, genderTitle, gender, houseTitle, house, dateOfBirthTitle, dateOfBirth, wizardTitle, wizard, ancestryTitle, ancestry, wandTitle, wand, patronusTitle, patronus, aliveTitle, alive)
}

const sorter = (callback) => {
    getCharacters()
    .then(charArray => {
        let newArr = charArray.sort(callback)
        newArr.forEach(makeHomeCard);
    })
}

const category = (callback) => {
    getCharacters()
    .then(charArray => {
        let newArr = charArray.filter(callback)
        newArr.forEach(makeHomeCard);
    })
}

const alphabetical = (a, b) => {
    if(a.name < b.name) {
        return -1
    } else if (a.name > b.name) {
        return 1
    } else {
        return 0
    }
}

const reverseAlpha = (a, b) => {
    if(a.name > b.name) {
        return -1
    } else if (a.name < b.name) {
        return 1
    } else {
        return 0
    }
}

const houseSort = (char, house) => {
    return char['house'] === house
}

const muggleSort = (char) => {
    return char.ancestry === 'muggle'
}

const searchMe = (e) => {
    let sort = e.target.value;
    clear()
    if (sort === 'Show All') {
        postCharacters()
    } else if (sort === 'A - Z') {
        sorter(alphabetical)
    } else if (sort === 'Z - A') {
        sorter(reverseAlpha)
    } else if (sort === 'Gryffindor') {
        category(char => houseSort(char, 'Gryffindor'))
    } else if (sort === 'Slytherin') {
        category(char => houseSort(char, 'Slytherin'))
    } else if (sort === 'Hufflepuff') {
        category(char => houseSort(char, 'Hufflepuff'))
    } else if (sort === 'Ravenclaw') {
        category(char => houseSort(char, 'Ravenclaw'))
    } else if (sort === 'Muggles') {
        category(muggleSort)
    }
}

function colorMe(char) {
    if (char.house === 'Gryffindor') {
        return 'red'
    } else if (char.house === 'Slytherin') {
        return 'green'
    } else if (char.house === 'Hufflepuff') {
        return 'gold'
    } else if (char.house === 'Ravenclaw') {
        return 'blue'
    }
}

function moreInfo(e) {
    clear()
    let charId = e.target.id
    fetchOne(charId)
    .then(char => {
        makeHeaderCard(char[0])
        moreInfoCard(char[0])
    })
}

function clear() {
    characters.innerHTML = ''
    infoDiv.innerHTML = ''
}

function capital(word) {
    let first = word.charAt(0).toUpperCase()
    let remaining = word.slice(1)
    return first + remaining
}

function words(string, callback) {
    let newArr = string.split(' ')
    let final = newArr.map(callback)
    return final.join(' ')
}

function hover(e) {
    e.target.className += ' hover-target'
    e.target.innerText = addArrow(e.target.innerText)
}

function offHover(e) {
    e.target.className = 'character-name'
    e.target.innerText = removeArrow(e.target.innerText)
}
function addArrow(string) {
    return '»»—— ' + string + ' ——««'
}

function removeArrow(string) {
    let newArr = string.split(' ')
    newArr.pop();
    newArr.shift();
    return newArr.join(' ')
}

//API - Fetch
function getCharacters() {
    return fetch('https://hp-api.onrender.com/api/characters')
    .then(response => response.json())
}
function fetchOne(id) {
    return fetch(`https://hp-api.onrender.com/api/character/${id}`)
    .then(response => response.json())
}