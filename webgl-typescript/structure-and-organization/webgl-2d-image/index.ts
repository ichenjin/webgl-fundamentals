namespace webgl_2d_image_my {
    function main() {
        let image = new Image();
        image.src = "../../../webgl/resources/leaves.jpg";  // MUST BE SAME DOMAIN!!!
        image.onload = function () {
            render(image);
        }
    }

    function setupUi(canvas: HTMLCanvasElement) {
        webglLessonsHelper.setupLesson(canvas);
    }

    function render(image: HTMLImageElement) {
        // Get A WebGL context
        /** @type {HTMLCanvasElement} */
        let canvas = <HTMLCanvasElement>document.getElementById("canvas");
        setupUi(canvas);

        let gl = canvas.getContext("webgl");
        if (!gl) {
            webglLessonsHelper.showNeedWebGL(canvas);
            return;
        }

        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Create a texture.
        createTexture(gl, image);

        // setup GLSL program
        let program = webglUtils.createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);
        let attribSetters = webglUtils.createAttributeSetters(gl, program);
        let uniformSetters = webglUtils.createUniformSetters(gl, program);

        let arrays: GLArrays = {
            position: {
                numComponents: 2, data: rectBufferData(gl, image.width, image.height),
            },
            texCoord: {
                numComponents: 2, data: textureBufferData()
            },
        };
        let bufferInfo = webglUtils.createBufferInfoFromArrays(gl, arrays);

        let uniforms = {
            u_matrix: m3.identity()
        }

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, 50, 50);

        uniforms.u_matrix = matrix;

        webglUtils.setBuffersAndAttributes(gl, attribSetters, bufferInfo);
        webglUtils.setUniforms(uniformSetters, uniforms);

        // Draw the rectangle.
        gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
    }

    function rectBufferData(gl: WebGLRenderingContext, width: number, height: number) {
        return [
            0, 0,
            width, 0,
            0, height,
            0, height,
            width, 0,
            width, height,
        ]
    }

    function textureBufferData() {
        return [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,
        ];
    }

    function createTexture(gl: WebGLRenderingContext,image: HTMLImageElement) {
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

    main();
}