var FizzyText = function() {
    this.message = 'dat.gui';
    this.speed = 0.8;
    this.displayOutline = false;
    this.explode = function() { console.log('explode') };
};

window.onload = function() {
    var text = new FizzyText();
    var gui = new dat.GUI();
    /*
    gui.add(text, 'message');
    gui.add(text, 'speed', -5, 5);
    gui.add(text, 'displayOutline');
    gui.add(text, 'explode');
    */
};
