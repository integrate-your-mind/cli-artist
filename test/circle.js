let engine = require('../engine');

const setup = () => {
    
}

const draw = () => {
    engine.fillBackground("red");
    engine.fillForeground("red");
    engine.drawCircle(engine.width / 2, engine.height / 2, 20, "o");
}

engine = engine(setup, draw) 