const createDrumArray = () => new Array(16).fill(false);

// Drum Arrays
let kicks = createDrumArray()
let snares = createDrumArray()
let hiHats = createDrumArray()
let rideCymbals = createDrumArray()

const getArrayFromName = (name) => {
    switch (name) {
        case 'kicks':
            return kicks;
        case 'snares':
            return snares;
        case 'hiHats':
            return hiHats;
        case 'rideCymbals':
            return rideCymbals;
    }
}

const toggleDrum = (drumType, index) => {

    const drumArray = getArrayFromName(drumType);

    if (!drumArray || index < 0 || index > 15) {
        return;
    }

    drumArray[index] = !drumArray[index];
}

const clear = (drumType) => {
    const drumArray = getArrayFromName(drumType);

    if (!drumArray) {
        return;
    }

    drumArray.fill(false);
}

const invert = (drumType) => {
    const drumArray = getArrayFromName(drumType);

    if (!drumArray) {
        return;
    }

    for (let i = 0; i < drumArray.length; i++) {
        drumArray[i] = !drumArray[i];
    }
}

const getNeighborPads = (x, y, size) => {
    let s = size - 1;
    
    if (x < 0 || y < 0 || x > s || y > s) {
        return [];
    }

    const neighbors = [[x-1, y], [x+1, y], [x, y+1], [x, y-1]]

    return neighbors.filter(e => {
       return e.every(c => c >= 0 && c < size);
    })
}