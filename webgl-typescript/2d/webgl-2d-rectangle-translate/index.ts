namespace webgl_2d_rectangle_translate {

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

        // look up where the vertex data needs to go.
        let positionLocation = gl.getAttribLocation(program, "a_position");

        // lookup uniforms
        let resolutionLocation = gl.getUniformLocation(program, "u_resolution");
        let colorLocation = gl.getUniformLocation(program, "u_color");

        // Create a buffer to put positions in
        let positionBuffer = gl.createBuffer();

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        let translation = new Float32Array([0, 0]);
        let width = 100;
        let height = 30;
        let color = new Float32Array([Math.random(), Math.random(), Math.random(), 1]);

        drawScene();

        // Setup a ui.
        webglLessonsHelper.setupSlider("#x", { slide: updatePosition(0), max: gl.canvas.width });
        webglLessonsHelper.setupSlider("#y", { slide: updatePosition(1), max: gl.canvas.height });

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

            // Setup a rectangle
            setRectangle(gl, translation[0], translation[1], width, height);

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

            // Draw the rectangle.
            let primitiveType = gl.TRIANGLES;
            offset = 0;
            let count = 6;
            gl.drawArrays(primitiveType, offset, count);
        }
    }

    // Fill the buffer with the values that define a rectangle.
    function setRectangle(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number) {
        let x1 = x;
        let x2 = x + width;
        let y1 = y;
        let y2 = y + height;
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                x1, y1,
                x2, y1,
                x1, y2,
                x1, y2,
                x2, y1,
                x2, y2,
            ]),
            gl.STATIC_DRAW);
    }

    main();
}