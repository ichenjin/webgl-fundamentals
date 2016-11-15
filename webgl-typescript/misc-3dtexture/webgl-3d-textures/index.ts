namespace webgl_3d_texures {

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
        let program = webglUtils.createProgramFromScripts(gl, ["3d-vertex-shader", "3d-fragment-shader"]);
        //gl.useProgram(program);

        //gl.enable(gl.CULL_FACE);
        //gl.enable(gl.DEPTH_TEST);

        // look up where the vertex data needs to go.
        let positionLocation = gl.getAttribLocation(program, "a_position");
        let texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

        // lookup uniforms
        let matrixLocation = gl.getUniformLocation(program, "u_matrix");
        let textureLocation = gl.getUniformLocation(program, "u_texture");

        // Create a buffer to put positions in
        let positionBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Put geometry data into buffer
        setGeometry(gl);

        // provide texture coordinates for the rectangle.
        let texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        // Set Texcoords.
        setTexcoords(gl);

        // Create a texture.
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));
        // Asynchronously load an image
        var image = new Image();
        image.src = "../../../webgl/resources/f-texture.png";
        image.addEventListener('load', function () {
            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });

        let fieldOfViewRadians = degToRad(60);
        let modelXRotationRadians = degToRad(0);
        let modelYRotationRadians = degToRad(0);
        let then = 0;

        requestAnimationFrame(drawScene);

        // Draw a the scene.
        function drawScene(now) {

            // Convert to seconds
            now *= 0.001;
            // Subtract the previous time from the current time
            let deltaTime = now - then;
            // Remember the current time for the next frame.
            then = now;

            webglUtils.resizeCanvasToDisplaySize(gl.canvas);
            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            // Animate the rotation
            modelXRotationRadians += 1.2 * deltaTime;
            modelYRotationRadians += 0.7 * deltaTime;

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

            // Turn on the color attribute
            gl.enableVertexAttribArray(texcoordLocation);

            // Bind the color buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

            // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
            size = 2;                 // 3 components per iteration
            type = gl.FLOAT;  // the data is 8bit unsigned values
            normalize = false;         // normalize the data (convert from 0-255 to 0-1)
            stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
            offset = 0;               // start at the beginning of the buffer
            gl.vertexAttribPointer(
                texcoordLocation, size, type, normalize, stride, offset)


            let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            let projectionMatrix =
                m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

            let cameraPosition: Vector3 = [0, 0, 200];
            let up: Vector3 = [0, 1, 0];
            let target: Vector3 = [0, 0, 0];

            // Compute the camera's matrix using look at.
            let cameraMatrix = m4.lookAt(cameraPosition, target, up);

            // Make a view matrix from the camera matrix.
            let viewMatrix = m4.inverse(cameraMatrix);

            let viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

            let matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);
            matrix = m4.yRotate(matrix, modelYRotationRadians);

            // Set the matrix.
            gl.uniformMatrix4fv(matrixLocation, false, new Float32Array(matrix));

            // Tell the shader to use texture unit 0 for u_texture
            gl.uniform1i(textureLocation, 0);

            // Draw the geometry.
            gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);

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

    // Fill the buffer with texture coordinates the F.
    function setTexcoords(gl) {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                // left column front
                0, 0,
                0, 1,
                1, 0,
                0, 1,
                1, 1,
                1, 0,

                // top rung front
                0, 0,
                0, 1,
                1, 0,
                0, 1,
                1, 1,
                1, 0,

                // middle rung front
                0, 0,
                0, 1,
                1, 0,
                0, 1,
                1, 1,
                1, 0,

                // left column back
                0, 0,
                1, 0,
                0, 1,
                0, 1,
                1, 0,
                1, 1,

                // top rung back
                0, 0,
                1, 0,
                0, 1,
                0, 1,
                1, 0,
                1, 1,

                // middle rung back
                0, 0,
                1, 0,
                0, 1,
                0, 1,
                1, 0,
                1, 1,

                // top
                0, 0,
                1, 0,
                1, 1,
                0, 0,
                1, 1,
                0, 1,

                // top rung right
                0, 0,
                1, 0,
                1, 1,
                0, 0,
                1, 1,
                0, 1,

                // under top rung
                0, 0,
                0, 1,
                1, 1,
                0, 0,
                1, 1,
                1, 0,

                // between top rung and middle
                0, 0,
                1, 1,
                0, 1,
                0, 0,
                1, 0,
                1, 1,

                // top of middle rung
                0, 0,
                1, 1,
                0, 1,
                0, 0,
                1, 0,
                1, 1,

                // right of middle rung
                0, 0,
                1, 1,
                0, 1,
                0, 0,
                1, 0,
                1, 1,

                // bottom of middle rung.
                0, 0,
                0, 1,
                1, 1,
                0, 0,
                1, 1,
                1, 0,

                // right of bottom
                0, 0,
                1, 1,
                0, 1,
                0, 0,
                1, 0,
                1, 1,

                // bottom
                0, 0,
                0, 1,
                1, 1,
                0, 0,
                1, 1,
                1, 0,

                // left side
                0, 0,
                0, 1,
                1, 1,
                0, 0,
                1, 1,
                1, 0]),
            gl.STATIC_DRAW);
    }

    main();
}