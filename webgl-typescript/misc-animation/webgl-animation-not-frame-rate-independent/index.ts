﻿namespace webgl_3d_animation_not_frame_rate_independent {

    function radToDeg(r) {
        return r * 180 / Math.PI;
    }

    function degToRad(d) {
        return d * Math.PI / 180;
    }

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

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        // look up where the vertex data needs to go.
        let positionLocation = gl.getAttribLocation(program, "a_position");

        // lookup uniforms
        let colorLocation = gl.getAttribLocation(program, "a_color");
        let matrixLocation = gl.getUniformLocation(program, "u_matrix");

        // Create a buffer to put positions in
        let positionBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Put geometry data into buffer
        setGeometry(gl);

        // Create a buffer for colors.
        let colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        // Put the colors in the buffer.
        setColors(gl);

        let translation = new Float32Array([200, 150, 0]);
        let rotation = new Float32Array([degToRad(40), degToRad(25), degToRad(325)]);
        let scale = new Float32Array([1, 1, 1]);
        let color = new Float32Array([Math.random(), Math.random(), Math.random(), 1]);

        let fieldOfViewRadians = degToRad(60);
        let rotationSpeed = 1.2;

        requestAnimationFrame(drawScene);

        // Draw a the scene.
        function drawScene() {

            // Every frame increase the rotation a little.
            rotation[1] += rotationSpeed / 60.0;

            webglUtils.resizeCanvasToDisplaySize(gl.canvas);
            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            // Clear the canvas AND the depth buffer.
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Tell it to use our program (pair of shaders)
            gl.useProgram(program);

            // Turn on the attribute
            gl.enableVertexAttribArray(positionLocation);

            // Bind the position buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            let size = 3;          // 2 components per iteration
            let type = gl.FLOAT;   // the data is 32bit floats
            let normalize = false; // don't normalize the data
            let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            let offset = 0;        // start at the beginning of the buffer
            gl.vertexAttribPointer(
                positionLocation, size, type, normalize, stride, offset)

            // set the color
            // Turn on the color attribute
            gl.enableVertexAttribArray(colorLocation);

            // Bind the color buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

            // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
            size = 3;                 // 3 components per iteration
            type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
            normalize = true;         // normalize the data (convert from 0-255 to 0-1)
            stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
            offset = 0;               // start at the beginning of the buffer
            gl.vertexAttribPointer(
                colorLocation, size, type, normalize, stride, offset)


            let left = 0;
            let right = gl.canvas.clientWidth;
            let bottom = gl.canvas.clientHeight;
            let top = 0;
            let near = 200;
            let far = -200;
            let matrix = m4.orthographic(left, right, bottom, top, near, far);

            // Compute the matrices
            matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
            matrix = m4.xRotate(matrix, rotation[0]);
            matrix = m4.yRotate(matrix, rotation[1]);
            matrix = m4.zRotate(matrix, rotation[2]);
            matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

            // Set the matrix.
            gl.uniformMatrix4fv(matrixLocation, false, new Float32Array(matrix));

            // Draw the rectangle.
            let primitiveType = gl.TRIANGLES;
            offset = 0;
            let count = 16 * 6;
            gl.drawArrays(primitiveType, offset, count);

            // Call drawScene again next frame
            requestAnimationFrame(drawScene);
        }
    }

    // Fill the buffer with the values that define a letter 'F'.
    function setGeometry(gl: WebGLRenderingContext) {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                // left column front
                0, 0, 0,
                0, 150, 0,
                30, 0, 0,
                0, 150, 0,
                30, 150, 0,
                30, 0, 0,

                // top rung front
                30, 0, 0,
                30, 30, 0,
                100, 0, 0,
                30, 30, 0,
                100, 30, 0,
                100, 0, 0,

                // middle rung front
                30, 60, 0,
                30, 90, 0,
                67, 60, 0,
                30, 90, 0,
                67, 90, 0,
                67, 60, 0,

                // left column back
                0, 0, 30,
                30, 0, 30,
                0, 150, 30,
                0, 150, 30,
                30, 0, 30,
                30, 150, 30,

                // top rung back
                30, 0, 30,
                100, 0, 30,
                30, 30, 30,
                30, 30, 30,
                100, 0, 30,
                100, 30, 30,

                // middle rung back
                30, 60, 30,
                67, 60, 30,
                30, 90, 30,
                30, 90, 30,
                67, 60, 30,
                67, 90, 30,

                // top
                0, 0, 0,
                100, 0, 0,
                100, 0, 30,
                0, 0, 0,
                100, 0, 30,
                0, 0, 30,

                // top rung right
                100, 0, 0,
                100, 30, 0,
                100, 30, 30,
                100, 0, 0,
                100, 30, 30,
                100, 0, 30,

                // under top rung
                30, 30, 0,
                30, 30, 30,
                100, 30, 30,
                30, 30, 0,
                100, 30, 30,
                100, 30, 0,

                // between top rung and middle
                30, 30, 0,
                30, 60, 30,
                30, 30, 30,
                30, 30, 0,
                30, 60, 0,
                30, 60, 30,

                // top of middle rung
                30, 60, 0,
                67, 60, 30,
                30, 60, 30,
                30, 60, 0,
                67, 60, 0,
                67, 60, 30,

                // right of middle rung
                67, 60, 0,
                67, 90, 30,
                67, 60, 30,
                67, 60, 0,
                67, 90, 0,
                67, 90, 30,

                // bottom of middle rung.
                30, 90, 0,
                30, 90, 30,
                67, 90, 30,
                30, 90, 0,
                67, 90, 30,
                67, 90, 0,

                // right of bottom
                30, 90, 0,
                30, 150, 30,
                30, 90, 30,
                30, 90, 0,
                30, 150, 0,
                30, 150, 30,

                // bottom
                0, 150, 0,
                0, 150, 30,
                30, 150, 30,
                0, 150, 0,
                30, 150, 30,
                30, 150, 0,

                // left side
                0, 0, 0,
                0, 0, 30,
                0, 150, 30,
                0, 0, 0,
                0, 150, 30,
                0, 150, 0]),
            gl.STATIC_DRAW);
    }

    // Fill the buffer with colors for the 'F'.
    function setColors(gl) {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Uint8Array([
                // left column front
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,

                // top rung front
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,

                // middle rung front
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,
                200, 70, 120,

                // left column back
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,

                // top rung back
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,

                // middle rung back
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,
                80, 70, 200,

                // top
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,
                70, 200, 210,

                // top rung right
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,
                200, 200, 70,

                // under top rung
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,
                210, 100, 70,

                // between top rung and middle
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,
                210, 160, 70,

                // top of middle rung
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,
                70, 180, 210,

                // right of middle rung
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,
                100, 70, 210,

                // bottom of middle rung.
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,
                76, 210, 100,

                // right of bottom
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,
                140, 210, 80,

                // bottom
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,
                90, 130, 110,

                // left side
                160, 160, 220,
                160, 160, 220,
                160, 160, 220,
                160, 160, 220,
                160, 160, 220,
                160, 160, 220]),
            gl.STATIC_DRAW);
    }

    main();
}