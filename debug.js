let debugMode = true;

if(debugMode) {
    setInterval(DisplayData, 20);
}


function DisplayData() {
    let debugDiv = document.getElementById('debugDiv');
    
    let text = `
    Pos: ${player1.x} ${player1.y}
    Size: ${player1.width} ${player1.height}
    Vel: ${player1.vX} ${player1.vY}
    Input: ${input.x} ${input.y}
    `;
    debugDiv.innerText = text;
}