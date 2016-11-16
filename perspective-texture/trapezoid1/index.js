var webgl_2d_image_my;
(function (webgl_2d_image_my) {
    function main() {
        var image = new Image();
        //image.width = 256;
        //image.height = 256;
        //image.src = "../../../webgl/resources/leaves.jpg";  // MUST BE SAME DOMAIN!!!
        image.src = "../checkerboard.jpg";
        image.onload = function () {
            render(image);
        };
    }
    function setupUi(canvas) {
        webglLessonsHelper.setupLesson(canvas);
    }
    function render(image) {
        // Get A WebGL context
        /** @type {HTMLCanvasElement} */
        var canvas = document.getElementById("canvas");
        setupUi(canvas);
        var gl = canvas.getContext("webgl");
        if (!gl) {
            webglLessonsHelper.showNeedWebGL(canvas);
            return;
        }
        // Create a buffer to put three 2d clip space points in
        var positionBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Set a rectangle the same size as the image.
        setTrapezoid(gl, image.width, image.height);
        // provide texture coordinates for the rectangle.
        var texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        var tw = image.width;
        var tnw = tw / 2;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0, 0.0, 0.0, tw,
            tw, 0.0, 0.0, tw,
            0.0, tw, 0.0, tw,
            tw, tw, 0.0, tw,
        ]), gl.STATIC_DRAW);
        // Create a texture.
        setTexture(gl, image);
        // setup GLSL program
        var program = webglUtils.createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);
        // look up where the vertex data needs to go.
        var positionLocation = gl.getAttribLocation(program, "a_position");
        var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");
        var matrixLocation = gl.getUniformLocation(program, "u_matrix");
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);
        // Turn on the position attribute
        gl.enableVertexAttribArray(positionLocation);
        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2; // 2 components per iteration
        var type = gl.FLOAT; // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0; // start at the beginning of the buffer
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
        // Turn on the teccord attribute
        gl.enableVertexAttribArray(texcoordLocation);
        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        // Tell the position attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
        size = 4; // 2 components per iteration
        type = gl.FLOAT; // the data is 32bit floats
        normalize = false; // don't normalize the data
        stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        offset = 0; // start at the beginning of the buffer
        gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);
        var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, 10, 10);
        gl.uniformMatrix3fv(matrixLocation, false, new Float32Array(matrix));
        // Draw the rectangle.
        var primitiveType = gl.TRIANGLE_STRIP;
        offset = 0;
        var count = 4;
        gl.drawArrays(primitiveType, offset, count);
    }
    function setRectangle(gl, width, height) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            width, 0,
            0, height,
            0, height,
            width, 0,
            width, height,
        ]), gl.STATIC_DRAW);
    }
    function setTrapezoid(gl, width, height) {
        var narrowWidth = width / 2;
        //narrowWidth = width;
        var offset = (width - narrowWidth) / 2;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            width, 0,
            offset, height,
            width - offset, height,
        ]), gl.STATIC_DRAW);
    }
    function setTrapezoid_bak(gl, width, height) {
        var narrowWidth = width / 2;
        var offset = (width - narrowWidth) / 2;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            width, 0,
            offset, height,
            offset, height,
            width, 0,
            width - offset, height,
        ]), gl.STATIC_DRAW);
    }
    function setTexture(gl, image) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // Upload the image into the texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }
    main();
})(webgl_2d_image_my || (webgl_2d_image_my = {}));
//# sourceMappingURL=index.js.map