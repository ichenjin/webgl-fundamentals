namespace webgl_2d_geometry_matrix_transform_with_projection {

    function main() {
        // Get A WebGL context
        /** @type {HTMLCanvasElement} */
        let canvas = <HTMLCanvasElement>document.getElementById("canvas");
        webglLessonsHelper.setupLesson(canvas);
        let gl = canvas.getContext("webgl");
        if (!gl) {
            webglLessonsHelper.showNeedWebGL(canvas);
            return;
        }

        // setup GLSL program
        let program = webglUtils.createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);
        gl.useProgram(program);

        // look up where the vertex data needs to go.
        let positionLocation = gl.getAttribLocation(program, "a_position");

        // lookup uniforms
        let resolutionLocation = gl.getUniformLocation(program, "u_resolution");
        let colorLocation = gl.getUniformLocation(program, "u_color");
        let matrixLocation = gl.getUniformLocation(program, "u_matrix");

        // Create a buffer to put positions in
        let positionBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Put geometry data into buffer
        setGeometry(gl);

        let scale = new Float32Array([1, 1]);
        let angleInRadians = 0;
        let translation = new Float32Array([200, 150]);
        let width = 100;
        let height = 30;
        let color = new Float32Array([Math.random(), Math.random(), Math.random(), 1]);

        drawScene();

        // Setup a ui.
        webglLessonsHelper.setupSlider("#x", { value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
        webglLessonsHelper.setupSlider("#y", { value: translation[1], slide: updatePosition(1), max: gl.canvas.height });
        webglLessonsHelper.setupSlider("#angle", { slide: updateAngle, max: 360 });
        webglLessonsHelper.setupSlider("#scaleX", { value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2 });
        webglLessonsHelper.setupSlider("#scaleY", { value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2 });

        function updateAngle(event, ui) {
            let angleInDegrees = 360 - ui.value;
            angleInRadians = angleInDegrees * Math.PI / 180;
            drawScene();
        }

        function updateScale(index) {
            return function (event, ui) {
                scale[index] = ui.value;
                drawScene();
            }
        }

        function updatePosition(index) {
            return function (event, ui) {
                translation[index] = ui.value;
                drawScene();
            }
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
            let size = 2;          // 2 components per iteration
            let type = gl.FLOAT;   // the data is 32bit floats
            let normalize = false; // don't normalize the data
            let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            let offset = 0;        // start at the beginning of the buffer
            gl.vertexAttribPointer(
                positionLocation, size, type, normalize, stride, offset)

            // set the resolution
            gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

            // set the color
            gl.uniform4fv(colorLocation, color);

            let projectionMatrix = m3.projection(
                gl.canvas.clientWidth, gl.canvas.clientHeight);

            // Compute the matrix
            let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
            matrix = m3.translate(matrix, translation[0], translation[1]);
            matrix = m3.rotate(matrix, angleInRadians);
            matrix = m3.scale(matrix, scale[0], scale[1]);

            // Set the matrix.
            gl.uniformMatrix3fv(matrixLocation, false, new Float32Array(matrix));

            // Draw the rectangle.
            let primitiveType = gl.TRIANGLES;
            offset = 0;
            let count = 3;
            gl.drawArrays(primitiveType, offset, count);
        }
    }

    // Fill the buffer with the values that define a triangle.
    function setGeometry(gl) {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                0, -100,
                150, 125,
                -175, 100]),
            gl.STATIC_DRAW);
    }

    main();
}