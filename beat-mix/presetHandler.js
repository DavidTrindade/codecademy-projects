// Use this presets array inside your presetHandler
const presets = require('./presets');

// Complete this function:
const presetHandler = (method, presetIndex, newPresetArray) => {
    if (method === 'GET') {
        let preset = presets[presetIndex];
        if (preset) {
            return [200, preset]
        } else {
            return [404]
        }
        
    }

    if (method === 'PUT') {
        if (!presets[presetIndex]) {
            return [404];
        }
        presets[presetIndex] = newPresetArray;
        return [200, presets[presetIndex]];
    }

    return [400]
};

// Leave this line so that your presetHandler function can be used elsewhere:
module.exports = presetHandler;
