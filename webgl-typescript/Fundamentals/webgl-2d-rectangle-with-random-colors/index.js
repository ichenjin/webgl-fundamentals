var webgl_2d_geometry_matrix_transform_with_projection;
(function (webgl_2d_geometry_matrix_transform_with_projection) {
    function main() {
        // Get A WebGL context
        /** @type {HTMLCanvasElement} */
        var canvas = document.getElementById("canvas");
        webglLessonsHelper.setupLesson(canvas);
        var gl = canvas.getContext("webgl");
        if (!gl) {
            webglLessonsHelper.showNeedWebGL(canvas);
            return;
        }
        // setup GLSL program
        var program = webglUtils.createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);
        gl.useProgram(program);
        // look up where the vertex data needs to go.
        var positionLocation = gl.getAttribLocation(program, "a_position");
        var colorLocation = gl.getAttribLocation(program, "a_color");
        // lookup uniforms
        var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
        var matrixLocation = gl.getUniformLocation(program, "u_matrix");
        // Create a buffer to put positions in
        var positionBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Put geometry data into buffer
        setGeometry(gl);
        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        setColors(gl);
        var scale = new Float32Array([1, 1]);
        var angleInRadians = 0;
        var translation = new Float32Array([200, 150]);
        var width = 100;
        var height = 30;
        var color = new Float32Array([Math.random(), Math.random(), Math.random(), 1]);
        drawScene();
        // Setup a ui.
        webglLessonsHelper.setupSlider("#x", { value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
        webglLessonsHelper.setupSlider("#y", { value: translation[1], slide: updatePosition(1), max: gl.canvas.height });
        webglLessonsHelper.setupSlider("#angle", { slide: updateAngle, max: 360 });
        webglLessonsHelper.setupSlider("#scaleX", { value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2 });
        webglLessonsHelper.setupSlider("#scaleY", { value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2 });
        function updateAngle(event, ui) {
            var angleInDegrees = 360 - ui.value;
            angleInRadians = angleInDegrees * Math.PI / 180;
            drawScene();
        }
        function updateScale(index) {
            return function (event, ui) {
                scale[index] = ui.value;
                drawScene();
            };
        }
        function updatePosition(index) {
            return function (event, ui) {
                translation[index] = ui.value;
                drawScene();
            };
        }
        // Draw a the scene.
        function drawScene() {
            webglUtils.resizeCanvasToDisplaySize(gl.canvas);
            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            // Clear the canvas.
            gl.clear(gl.COLOR_BUFFER_BIT);
            // Tell it to use our program (pair of shaders)
            gl.useProgram(program);
            // Turn on the attribute
            gl.enableVertexAttribArray(positionLocation);
            // Bind the position buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            var size = 2; // 2 components per iteration
            var type = gl.FLOAT; // the data is 32bit floats
            var normalize = false; // don't normalize the data
            var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
            var offset = 0; // start at the beginning of the buffer
            gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
            // turn on color
            gl.enableVertexAttribArray(colorLocation);
            // Bind the color buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            // Tell the color attribute how to get data out of colorBuffer (ARRAY_BUFFER)
            size = 4; // 4 components per iteration
            type = gl.FLOAT; // the data is 32bit floats
            normalize = false; // don't normalize the data
            stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
            offset = 0; // start at the beginning of the buffer
            gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);
            // set the resolution
            gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
            // set the color
            //gl.uniform4fv(colorLocation, color);
            var projectionMatrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
            // Compute the matrix
            var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
            matrix = m3.translate(matrix, translation[0], translation[1]);
            matrix = m3.rotate(matrix, angleInRadians);
            matrix = m3.scale(matrix, scale[0], scale[1]);
            // Set the matrix.
            gl.uniformMatrix3fv(matrixLocation, false, new Float32Array(matrix));
            // Bind the color buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            // Draw the rectangle.
            var primitiveType = gl.TRIANGLES;
            offset = 0;
            var count = 6;
            gl.drawArrays(primitiveType, offset, count);
        }
    }
    // Fill the buffer with the values that define a triangle.
    function setGeometry(gl) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -150, -100,
            150, -100,
            -150, 100,
            150, -100,
            -150, 100,
            150, 100]), gl.STATIC_DRAW);
    }
    // Fill the buffer with colors for the 2 triangles
    // that make the rectangle.
    function setColors(gl) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([Math.random(), Math.random(), Math.random(), 1,
            Math.random(), Math.random(), Math.random(), 1,
            Math.random(), Math.random(), Math.random(), 1,
            Math.random(), Math.random(), Math.random(), 1,
            Math.random(), Math.random(), Math.random(), 1,
            Math.random(), Math.random(), Math.random(), 1]), gl.STATIC_DRAW);
    }
    main();
})(webgl_2d_geometry_matrix_transform_with_projection || (webgl_2d_geometry_matrix_transform_with_projection = {}));
//# sourceMappingURL=index.js.map