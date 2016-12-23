namespace webgl_3d_perspective_w_matrix {

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

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        createTexture(gl, image);

        // setup GLSL program
        let program = webglUtils.createProgramFromScripts(gl, ["3d-vertex-shader", "3d-fragment-shader"]);

        let attrSetters = webglUtils.createAttributeSetters(gl, program);
        let uniformSetters = webglUtils.createUniformSetters(gl, program);

        let narrowWidth = width / 4;

        let arrays: GLArrays = {
            position: {
                numComponents: 3,
                data: geometryBufferData(width, narrowWidth, height)
            },
            texCoord: {
                numComponents: 4,
                data: textureBufferData(width, narrowWidth)
            },
        };
        let bufferInfo = webglUtils.createBufferInfoFromArrays(gl, arrays);

        let uniforms = {
            u_matrix: m4.identity()
        };

        let translation = new Float32Array([0, 0, -360]);
        let rotation = new Float32Array([0, 0, 0]);
        let scale = new Float32Array([1, 1, 1]);
        let fieldOfViewRadians = degToRad(60);

        drawScene();

        // Setup a ui.
        webglLessonsHelper.setupSlider("#fieldOfView", { value: radToDeg(fieldOfViewRadians), slide: updateFieldOfView, min: 1, max: 179 });
        webglLessonsHelper.setupSlider("#x", { value: translation[0], slide: updatePosition(0), min: -200, max: 200 });
        webglLessonsHelper.setupSlider("#y", { value: translation[1], slide: updatePosition(1), min: -200, max: 200 });
        webglLessonsHelper.setupSlider("#z", { value: translation[2], slide: updatePosition(2), min: -1000, max: 0 });
        webglLessonsHelper.setupSlider("#angleX", { value: radToDeg(rotation[0]), slide: updateRotation(0), min: -90, max: 90 });
        webglLessonsHelper.setupSlider("#angleY", { value: radToDeg(rotation[1]), slide: updateRotation(1), min: -90, max: 90 });
        webglLessonsHelper.setupSlider("#angleZ", { value: radToDeg(rotation[2]), slide: updateRotation(2), max: 360 });
        webglLessonsHelper.setupSlider("#scaleX", { value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2 });
        webglLessonsHelper.setupSlider("#scaleY", { value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2 });
        webglLessonsHelper.setupSlider("#scaleZ", { value: scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2 });

        function updateFieldOfView(event, ui) {
            fieldOfViewRadians = degToRad(ui.value);
            drawScene();
        }

        function updateRotation(index) {
            return function (event, ui) {
                var angleInDegrees = ui.value;
                var angleInRadians = angleInDegrees * Math.PI / 180;
                rotation[index] = angleInRadians;
                drawScene();
            }
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
            // Clear the canvas AND the depth buffer.
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Tell it to use our program (pair of shaders)
            gl.useProgram(program);

            let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            let zNear = 1;
            let zFar = 2000;
            let matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

            // Compute the matrices
            matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
            matrix = m4.xRotate(matrix, rotation[0]);
            matrix = m4.yRotate(matrix, rotation[1]);
            matrix = m4.zRotate(matrix, rotation[2]);
            matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

            uniforms.u_matrix = matrix;
            // Set the matrix.
            webglUtils.setBuffersAndAttributes(gl, attrSetters, bufferInfo);
            webglUtils.setUniforms(uniformSetters, uniforms);

            // Draw the rectangle.
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, bufferInfo.numElements);
        }
    }

    function geometryBufferData(wide: number, narrow: number, height: number) {
        return [
            - narrow / 2, - height / 2, 0,
            + narrow / 2, - height / 2, 0,
            - wide / 2, + height / 2, 0,
            //- wide / 2, + height / 2, 0,
            //+ narrow / 2, - height / 2, 0,
            + wide / 2, + height / 2, 0,
        ]
    }

    function textureBufferData(wide: number, narrow: number) {
        return [
            0, 0, 0, narrow,
            narrow, 0, 0, narrow,
            0, wide, 0, wide,
            //0, wide, wide,
            //narrow, 0, narrow,
            wide, wide, 0, wide,
        ];
    }

    function createTexture(gl: WebGLRenderingContext, image: HTMLImageElement) {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Upload the image into the texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }

    let width = 256;
    let height = 256;

    let image = new Image();
    //image.src = "../../../webgl/resources/leaves.jpg";  // MUST BE SAME DOMAIN!!!
    image.src = "../../checkerboard.jpg";
    image.onload = function () {
        main();
    }
}