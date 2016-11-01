var webgl_2d_geometry_scale;
(function (webgl_2d_geometry_scale) {
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
        // lookup uniforms
        var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
        var colorLocation = gl.getUniformLocation(program, "u_color");
        var translationLocation = gl.getUniformLocation(program, "u_translation");
        var rotationLocation = gl.getUniformLocation(program, "u_rotation");
        var scaleLocation = gl.getUniformLocation(program, "u_scale");
        // Create a buffer to put positions in
        var positionBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Put geometry data into buffer
        setGeometry(gl);
        var scale = new Float32Array([1, 1]);
        var rotation = new Float32Array([0, 1]);
        var translation = new Float32Array([0, 0]);
        var width = 100;
        var height = 30;
        var color = new Float32Array([Math.random(), Math.random(), Math.random(), 1]);
        drawScene();
        // Setup a ui.
        webglLessonsHelper.setupSlider("#x", { slide: updatePosition(0), max: gl.canvas.width });
        webglLessonsHelper.setupSlider("#y", { slide: updatePosition(1), max: gl.canvas.height });
        webglLessonsHelper.setupSlider("#angle", { slide: updateAngle, max: 360 });
        webglLessonsHelper.setupSlider("#scaleX", { value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2 });
        webglLessonsHelper.setupSlider("#scaleY", { value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2 });
        function updateAngle(event, ui) {
            var angleInDegrees = 360 - ui.value;
            var angleInRadians = angleInDegrees * Math.PI / 180;
            rotation[0] = Math.sin(angleInRadians);
            rotation[1] = Math.cos(angleInRadians);
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
            // Setup a rectangle
            //setGeometry(gl, translation[0], translation[1], width, height);
            // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            var size = 2; // 2 components per iteration
            var type = gl.FLOAT; // the data is 32bit floats
            var normalize = false; // don't normalize the data
            var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
            var offset = 0; // start at the beginning of the buffer
            gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
            // set the resolution
            gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
            // set the color
            gl.uniform4fv(colorLocation, color);
            // Set the translation.
            gl.uniform2fv(translationLocation, translation);
            // set the rotation
            gl.uniform2fv(rotationLocation, rotation);
            // Set the scale.
            gl.uniform2fv(scaleLocation, scale);
            // Draw the rectangle.
            var primitiveType = gl.TRIANGLES;
            offset = 0;
            var count = 18;
            gl.drawArrays(primitiveType, offset, count);
        }
    }
    // Fill the buffer with the values that define a letter 'F'.
    function setGeometry(gl) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            // left column
            0, 0,
            30, 0,
            0, 150,
            0, 150,
            30, 0,
            30, 150,
            // top rung
            30, 0,
            100, 0,
            30, 30,
            30, 30,
            100, 0,
            100, 30,
            // middle rung
            30, 60,
            67, 60,
            30, 90,
            30, 90,
            67, 60,
            67, 90,
        ]), gl.STATIC_DRAW);
    }
    main();
})(webgl_2d_geometry_scale || (webgl_2d_geometry_scale = {}));
//# sourceMappingURL=index.js.map