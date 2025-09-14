///////////////////////////////////////////////////////////////////
//    Tölvugrafík Verkefni 1 
//     Frogger 
//
//    Rúnar Þór Árnason September 2025
///////////////////////////////////////////////////////////////////
var gl;
var points;
var vPosition;
var uColor;
var bufferId;
var frogVertices;
var frogX = 0.0;
var frogY = -0.85;
var frogSize = 0.05;


window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.95, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    

    // Associate shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( vPosition );

    uColor = gl.getUniformLocation(program, "uColor");

    render();
};

function rect(x, y, w, h) {
    return new Float32Array([
        x, y,
        x+w, y,
        x, y+h,
        x, y+h,
        x+w, y,
        x+w, y+h
    ]);
}

function drawRect(x, y, w, h, color) {
    var vertices = rect(x, y, w, h);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(uColor, color);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function updateFrogVertices() {
    frogVertices = new Float32Array([
        frogX - frogSize, frogY,
        frogX + frogSize, frogY,
        frogX, frogY + 2*frogSize
    ])
}


window.addEventListener("keydown", function(event){
    var step = 0.05;
    switch(event.key) {
        case "ArrowUp":
            frogY += step;
            break;
        case "ArrowDown":
            frogY -= step;
            break;
        case "ArrowRight":
            frogX += step;
            break;
        case "ArrowLeft":
            frogX -= step;
            break;     
    }

    frogX = Math.max(-1 + frogSize, Math.min(1 - frogSize, frogX));
    frogY = Math.max(-1 + frogSize, Math.min(1 - frogSize, frogY));

    updateFrogVertices(); // uppfæra þríhyrninginn
    render();
} ); 






function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // --- Grass neðst og efst ---
    drawRect(-1.0, -1.0, 2.0, 0.2, [0.3, 0.6, 0.2, 1.0]);
    drawRect(-1.0, 0.8, 2.0, 0.2, [0.3, 0.6, 0.2, 1.0]);

    // --- 5 brautir ---
    drawRect(-1.0, -0.8, 2.0, 0.32, [0.2, 0.2, 0.2, 1]); 
    drawRect(-1.0, -0.48, 2.0, 0.32, [0.3, 0.3, 0.3, 1]); 
    drawRect(-1.0, -0.16, 2.0, 0.32, [0.2, 0.2, 0.2, 1]); 
    drawRect(-1.0, 0.16, 2.0, 0.32, [0.3, 0.3, 0.3, 1]); 
    drawRect(-1.0, 0.48, 2.0, 0.32, [0.2, 0.2, 0.2, 1]); 

    // --- Fríða (þríhyrningur) ---
    updateFrogVertices();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, frogVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(uColor, [1.0, 0.2, 0.2, 1]); 
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // --- Bílar ---


    requestAnimationFrame(render);

}



