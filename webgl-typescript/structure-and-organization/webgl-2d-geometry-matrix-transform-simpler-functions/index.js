var webgl_2d_geometry_matrix_transform_simpler_function;
(function (webgl_2d_geometry_matrix_transform_simpler_function) {
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
        var attribSetters = webglUtils.createAttributeSetters(gl, program);
        var uniformSetters = webglUtils.createUniformSetters(gl, program);
        var arrays = {
            position: { numComponents: 2, data: createBufferData() }
        };
        var bufferInfo = webglUtils.createBufferInfoFromArrays(gl, arrays);
        // lookup uniforms
        var colorLocation = gl.getUniformLocation(program, "u_color");
        var matrixLocation = gl.getUniformLocation(program, "u_matrix");
        var uniforms = {
            u_color: [Math.random(), Math.random(), Math.random(), 1],
            u_matrix: m3.identity()
        };
        var scale = new Float32Array([1, 1]);
        var translation = new Float32Array([0, 0]);
        var angleInRadians = 0;
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
            var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
            // Compute the matrices
            matrix = m3.translate(matrix, translation[0], translation[1]);
            matrix = m3.rotate(matrix, angleInRadians);
            matrix = m3.scale(matrix, scale[0], scale[1]);
            uniforms.u_matrix = matrix;
            // set positions
            webglUtils.setBuffersAndAttributes(gl, attribSetters, bufferInfo);
            // set color and matrices
            webglUtils.setUniforms(uniformSetters, uniforms);
            // Draw Geometry
            gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
        }
    }
    function createBufferData() {
        return [
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
        ];
    }
    main();
})(webgl_2d_geometry_matrix_transform_simpler_function || (webgl_2d_geometry_matrix_transform_simpler_function = {}));
//# sourceMappingURL=index.js.map