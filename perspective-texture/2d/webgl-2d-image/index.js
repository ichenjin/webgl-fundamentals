var webgl_2d_image_my;
(function (webgl_2d_image_my) {
    var width = 200;
    var height = 200;
    function main() {
        var image = new Image();
        image.src = "../../../webgl/resources/leaves.jpg"; // MUST BE SAME DOMAIN!!!
        image.onload = function () {
            render(image);
        };
    }
    function setupUi(canvas) {
        webglLessonsHelper.setupLesson(canvas);
    }
    function render(image) {
        // Get A WebGL context
        /** @type {HTMLCanvasElement} */
        var canvas = document.getElementById("canvas");
        setupUi(canvas);
        var gl = canvas.getContext("webgl");
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
        var program = webglUtils.createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);
        var attribSetters = webglUtils.createAttributeSetters(gl, program);
        var uniformSetters = webglUtils.createUniformSetters(gl, program);
        var arrays = {
            position: {
                numComponents: 3, data: rectBufferData(width, height),
            },
            texCoord: {
                numComponents: 3, data: textureBufferData()
            },
        };
        var bufferInfo = webglUtils.createBufferInfoFromArrays(gl, arrays);
        var uniforms = {
            u_matrix: m3.identity()
        };
        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);
        var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        //matrix = m3.translate(matrix, -xmid, -ymid);
        uniforms.u_matrix = matrix;
        webglUtils.setBuffersAndAttributes(gl, attribSetters, bufferInfo);
        webglUtils.setUniforms(uniformSetters, uniforms);
        // Draw the rectangle.
        gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
    }
    function rectBufferData(width, height) {
        return [
            -width / 2, -height / 2, 0,
            +width / 2, -height / 2, 0,
            -width / 2, +height / 2, 0,
            -width / 2, +height / 2, 0,
            +width / 2, -height / 2, 0,
            +width / 2, +height / 2, 0,
        ];
    }
    function textureBufferData() {
        return [
            0, 0, width,
            width, 0, width,
            0, width, width,
            0, width, width,
            width, 0, width,
            width, width, width,
        ];
    }
    function createTexture(gl, image) {
        var texture = gl.createTexture();
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
})(webgl_2d_image_my || (webgl_2d_image_my = {}));
//# sourceMappingURL=index.js.map