let debugMode = true;

if(debugMode) {
    setInterval(DisplayData, 20);
}


function DisplayData() {
    let debugDiv = document.getElementById('debugDiv');
    
    let text = `
    Pos: ${player1.pos.x} ${player1.pos.y}
    Size: ${player1.width} ${player1.height}
    Vel: ${player1.vel.x} ${player1.vel.y}
    Input: ${input.x} ${input.y}
    ball val ${ball.vel.x} ${ball.vel.y}
    `;
    debugDiv.innerText = text;
}