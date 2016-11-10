;
var webgl_3d_step1;
(function (webgl_3d_step1) {
    function radToDeg(r) {
        return r * 180 / Math.PI;
    }
    function degToRad(d) {
        return d * Math.PI / 180;
    }
    m4.projection = function (width, height, depth) {
        // Note: This matrix flips the Y axis so 0 is at the top.
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ];
    };
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
        var colorLocation = gl.getUniformLocation(program, "u_color");
        var matrixLocation = gl.getUniformLocation(program, "u_matrix");
        // Create a buffer to put positions in
        var positionBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Put geometry data into buffer
        setGeometry(gl);
        var translation = new Float32Array([45, 150, 0]);
        var rotation = new Float32Array([degToRad(40), degToRad(25), degToRad(325)]);
        var scale = new Float32Array([1, 1, 1]);
        var color = new Float32Array([Math.random(), Math.random(), Math.random(), 1]);
        drawScene();
        // Setup a ui.
        webglLessonsHelper.setupSlider("#x", { value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
        webglLessonsHelper.setupSlider("#y", { value: translation[1], slide: updatePosition(1), max: gl.canvas.height });
        webglLessonsHelper.setupSlider("#z", { value: translation[2], slide: updatePosition(2), max: gl.canvas.height });
        webglLessonsHelper.setupSlider("#angleX", { value: radToDeg(rotation[0]), slide: updateRotation(0), max: 360 });
        webglLessonsHelper.setupSlider("#angleY", { value: radToDeg(rotation[1]), slide: updateRotation(1), max: 360 });
        webglLessonsHelper.setupSlider("#angleZ", { value: radToDeg(rotation[2]), slide: updateRotation(2), max: 360 });
        webglLessonsHelper.setupSlider("#scaleX", { value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2 });
        webglLessonsHelper.setupSlider("#scaleY", { value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2 });
        webglLessonsHelper.setupSlider("#scaleZ", { value: scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2 });
        function updateRotation(index) {
            return function (event, ui) {
                var angleInDegrees = ui.value;
                var angleInRadians = angleInDegrees * Math.PI / 180;
                rotation[index] = angleInRadians;
                drawScene();
            };
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
            var size = 3; // 2 components per iteration
            var type = gl.FLOAT; // the data is 32bit floats
            var normalize = false; // don't normalize the data
            var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
            var offset = 0; // start at the beginning of the buffer
            gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
            // set the color
            gl.uniform4fv(colorLocation, color);
            var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
            // Compute the matrices
            matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
            matrix = m4.xRotate(matrix, rotation[0]);
            matrix = m4.yRotate(matrix, rotation[1]);
            matrix = m4.zRotate(matrix, rotation[2]);
            matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
            // Set the matrix.
            gl.uniformMatrix4fv(matrixLocation, false, new Float32Array(matrix));
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
            0, 0, 0,
            30, 0, 0,
            0, 150, 0,
            0, 150, 0,
            30, 0, 0,
            30, 150, 0,
            // top rung
            30, 0, 0,
            100, 0, 0,
            30, 30, 0,
            30, 30, 0,
            100, 0, 0,
            100, 30, 0,
            // middle rung
            30, 60, 0,
            67, 60, 0,
            30, 90, 0,
            30, 90, 0,
            67, 60, 0,
            67, 90, 0
        ]), gl.STATIC_DRAW);
    }
    main();
})(webgl_3d_step1 || (webgl_3d_step1 = {}));
//# sourceMappingURL=index.js.map