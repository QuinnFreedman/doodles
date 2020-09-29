//
// Helper functions to take care of the boilerplate for rendering single 2D
// shaders with webgl. Mostly take from here:
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/uniform
//

[window.create2dGlContext, window.draw2dGl] = (function(){

function getVsSource(version) {
    const attribute = version && version[0] === "3" ? "in" : "attribute"
    const varying = version && version[0] === "3" ? "out" : "varying"
    const versionStr = version ? `#version ${version}` : "";
    
    return `${versionStr}
      ${attribute} vec4 aVertexPosition;
      
      ${attribute} vec2 a_texCoord;
      ${varying} vec2 v_texCoord;

      void main() {
        gl_Position = aVertexPosition;

        v_texCoord = a_texCoord;
      }
    `;
}


//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function initBuffers(gl) {

  // Create a buffer for the square's positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square.

  const positions = [
    -1.0,  1.0,
     1.0,  1.0,
    -1.0, -1.0,
     1.0, -1.0,
  ];

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW);

  return {
    position: positionBuffer,
  };
}

function create2dGlContext(canvas, fsSource, uniformNames, version=null) {
    const gl = canvas.getContext("webgl2", {premultipliedAlpha: false})

    vsSource = getVsSource(version)
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const uniformLocations = {
        resolution: gl.getUniformLocation(shaderProgram, "u_resolution")
    }
    for (let name of uniformNames) {
        uniformLocations[name] =  gl.getUniformLocation(shaderProgram, "u_" + name)
    }
    
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: uniformLocations,
    }
    const buffers = initBuffers(gl)
    const resolution = [canvas.width, canvas.height]

    return { gl, programInfo, buffers, resolution }
}

function setImage(gl, programInfo, image) {
    const texCoordAttributeLocation = gl.getAttribLocation(programInfo.program, "a_texCoord")
    const imageLocation = gl.getUniformLocation(programInfo.program, "u_image")
    
    // provide texture coordinates for the rectangle.
    const texCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        1.0,  1.0,
        ]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(texCoordAttributeLocation)
    const size = 2          // 2 components per iteration
    const type = gl.FLOAT   // the data is 32bit floats
    const normalize = false // don't normalize the data
    const stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        texCoordAttributeLocation, size, type, normalize, stride, offset)

    // Create a texture.
    const texture = gl.createTexture()

    // make unit 0 the active texture uint
    // (ie, the unit all other texture commands will affect
    gl.activeTexture(gl.TEXTURE0 + 0)

    // Bind it to texture unit 0' 2D bind point
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // Set the parameters so we don't need mips and so we're not filtering
    // and we don't repeat
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    // Upload the image into the texture.
    const mipLevel = 0                // the largest mip
    const internalFormat = gl.RGBA    // format we want in the texture
    const srcFormat = gl.RGBA         // format of data we are supplying
    const srcType = gl.UNSIGNED_BYTE  // type of data we are supplying
    gl.texImage2D(gl.TEXTURE_2D,
                  mipLevel,
                  internalFormat,
                  srcFormat,
                  srcType,
                  image)
    gl.uniform1i(imageLocation, 0)
}

function draw2dGl({ gl, programInfo, buffers, resolution }, uniforms, image=null) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
        const numComponents = 2;  // pull out 2 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
                              // 0 = use type and numComponents above
        const offset = 0;         // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL to use our program when drawing

    gl.useProgram(programInfo.program);
    
    // Set the shader uniforms
    gl.uniform2fv(programInfo.uniformLocations.resolution, resolution)
    
    for (let key in uniforms) {
        let val = uniforms[key]
        if (Array.isArray(val)) {
            switch (val.length) {
            case 1:
                gl.uniform1fv(programInfo.uniformLocations[key], val)
            break;
            case 2:
                gl.uniform2fv(programInfo.uniformLocations[key], val)
            break;
            case 3:
                gl.uniform3fv(programInfo.uniformLocations[key], val)
            break;
            case 4:
                gl.uniform4fv(programInfo.uniformLocations[key], val)
            break;
            }
        } else {
            gl.uniform1f(programInfo.uniformLocations[key], val)
        }
        
    }

    if (image) {
        setImage(gl, programInfo, image)
    }
        

    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}

return [create2dGlContext, draw2dGl]

})();
