namespace webgl_2d_geometry_matrix_transform_with_projection {

    let m3 = {
        identity: function () {
            return [
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
            ];
        },
        projection: function (width, height) {
            // Note: This matrix flips the Y axis so that 0 is at the top.
            return [
                2 / width, 0, 0,
                0, -2 / height, 0,
                -1, 1, 1
            ];
        },
        translation: function (tx, ty) {
            return [
                1, 0, 0,
                0, 1, 0,
                tx, ty, 1,
            ];
        },

        rotation: function (angleInRadians) {
            let c = Math.cos(angleInRadians);
            let s = Math.sin(angleInRadians);
            return [
                c, -s, 0,
                s, c, 0,
                0, 0, 1,
            ];
        },

        scaling: function (sx, sy) {
            return [
                sx, 0, 0,
                0, sy, 0,
                0, 0, 1,
            ];
        },

        multiply: function (a, b) {
            let a00 = a[0 * 3 + 0];
            let a01 = a[0 * 3 + 1];
            let a02 = a[0 * 3 + 2];
            let a10 = a[1 * 3 + 0];
            let a11 = a[1 * 3 + 1];
            let a12 = a[1 * 3 + 2];
            let a20 = a[2 * 3 + 0];
            let a21 = a[2 * 3 + 1];
            let a22 = a[2 * 3 + 2];
            let b00 = b[0 * 3 + 0];
            let b01 = b[0 * 3 + 1];
            let b02 = b[0 * 3 + 2];
            let b10 = b[1 * 3 + 0];
            let b11 = b[1 * 3 + 1];
            let b12 = b[1 * 3 + 2];
            let b20 = b[2 * 3 + 0];
            let b21 = b[2 * 3 + 1];
            let b22 = b[2 * 3 + 2];
            return [
                b00 * a00 + b01 * a10 + b02 * a20,
                b00 * a01 + b01 * a11 + b02 * a21,
                b00 * a02 + b01 * a12 + b02 * a22,
                b10 * a00 + b11 * a10 + b12 * a20,
                b10 * a01 + b11 * a11 + b12 * a21,
                b10 * a02 + b11 * a12 + b12 * a22,
                b20 * a00 + b21 * a10 + b22 * a20,
                b20 * a01 + b21 * a11 + b22 * a21,
                b20 * a02 + b21 * a12 + b22 * a22,
            ];
        },
    };

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
        let translation = new Float32Array([0, 0]);
        let width = 100;
        let height = 30;
        let color = new Float32Array([Math.random(), Math.random(), Math.random(), 1]);

        drawScene();

        // Setup a ui.
        webglLessonsHelper.setupSlider("#x", { slide: updatePosition(0), max: gl.canvas.width });
        webglLessonsHelper.setupSlider("#y", { slide: updatePosition(1), max: gl.canvas.height });
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

            // Compute the matrices
            let translationMatrix = m3.translation(translation[0], translation[1]);
            let rotationMatrix = m3.rotation(angleInRadians);
            let scaleMatrix = m3.scaling(scale[0], scale[1]);

            // Multiply the matrices.
            let matrix = m3.multiply(projectionMatrix, translationMatrix);
            matrix = m3.multiply(matrix, rotationMatrix);
            matrix = m3.multiply(matrix, scaleMatrix);

            // Set the matrix.
            gl.uniformMatrix3fv(matrixLocation, false, new Float32Array(matrix));

            // Draw the rectangle.
            let primitiveType = gl.TRIANGLES;
            offset = 0;
            let count = 18;
            gl.drawArrays(primitiveType, offset, count);
        }
    }

    // Fill the buffer with the values that define a letter 'F'.
    function setGeometry(gl: WebGLRenderingContext) {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
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
            ]),
            gl.STATIC_DRAW);
    }

    main();
}