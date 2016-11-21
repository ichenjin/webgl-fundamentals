namespace webgl_2d_image_my {

    let width = 240;
    let height = 240;

    function main() {
        let image = new Image();
        //image.src = "../../../webgl/resources/leaves.jpg";  // MUST BE SAME DOMAIN!!!
        image.src = "../../checkerboard.jpg";
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

        let width2 = width * 1.5;

        let arrays: GLArrays = {
            position: {
                numComponents: 3, data: rectBufferData(width2),
            },
            texCoord: {
                numComponents: 3, data: textureBufferData(width2)
            },
        };
        let bufferInfo = webglUtils.createBufferInfoFromArrays(gl, arrays);

        let uniforms = {
            u_matrix: m3.identity()
        }

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        //matrix = m3.translate(matrix, -xmid, -ymid);

        uniforms.u_matrix = matrix;

        webglUtils.setBuffersAndAttributes(gl, attribSetters, bufferInfo);
        webglUtils.setUniforms(uniformSetters, uniforms);

        // Draw the rectangle.
        gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
    }

    function rectBufferData(width2?: number) {
        width2 = width2 || width;
        return [
            - width2 / 2, - height / 2, 0,
            + width2 / 2, - height / 2, 0,
            - width / 2, + height / 2, 0,

            - width / 2, + height / 2, 0,
            + width2 / 2, - height / 2, 0,
            + width / 2, + height / 2, 0,
        ]
    }

    function textureBufferData(width2?: number) {
        width2 = width2 || width;
        return [
            0, 0, width2,
            width2, 0, width2,
            0, width, width,

            0, width, width,
            width2, 0, width2,
            width, width, width,
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

    main();
}