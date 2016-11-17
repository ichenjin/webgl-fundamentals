namespace webgl_less_code_more_fun {

    let textureUtils: any = window["textureUtils"];
    let primitives: any = window["primitives"];
    let chroma: any = window["chroma"];

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

        let buffers = primitives.createSphereBuffers(gl, 10, 48, 24);

        // setup GLSL program
        let program = webglUtils.createProgramFromScripts(gl, ["3d-vertex-shader", "3d-fragment-shader"]);
        let uniformSetters = webglUtils.createUniformSetters(gl, program);
        let attribSetters = webglUtils.createAttributeSetters(gl, program);

        let attribs: GLAttributes = {
            a_position: { buffer: <WebGLBuffer>buffers.position, numComponents: 3, },
            a_normal: { buffer: <WebGLBuffer>buffers.normal, numComponents: 3, },
            a_texcoord: { buffer: <WebGLBuffer>buffers.texcoord, numComponents: 2, },
        };

        let cameraAngleRadians = degToRad(0);
        let fieldOfViewRadians = degToRad(60);
        let cameraHeight = 50;

        let uniformsThatAreTheSameForAllObjects = {
            u_lightWorldPos: [-50, 30, 100],
            u_viewInverse: m4.identity(),
            u_lightColor: [1, 1, 1, 1],
        };

        let uniformsThatAreComputedForEachObject = {
            u_worldViewProjection: m4.identity(),
            u_world: m4.identity(),
            u_worldInverseTranspose: m4.identity(),
        };

        let rand = function (min: number, max?: number) {
            if (max === undefined) {
                max = min;
                min = 0;
            }
            return min + Math.random() * (max - min);
        };

        let randInt = function (range) {
            return Math.floor(Math.random() * range);
        };
        let textures = [
            textureUtils.makeStripeTexture(gl, { color1: "#FFF", color2: "#CCC", }),
            textureUtils.makeCheckerTexture(gl, { color1: "#FFF", color2: "#CCC", }),
            textureUtils.makeCircleTexture(gl, { color1: "#FFF", color2: "#CCC", }),
        ];

        let objects = [];
        let numObjects = 300;
        let baseColor = rand(240);
        for (let ii = 0; ii < numObjects; ++ii) {
            objects.push({
                radius: rand(150),
                xRotation: rand(Math.PI * 2),
                yRotation: rand(Math.PI),
                materialUniforms: {
                    u_colorMult: chroma.hsv(rand(baseColor, baseColor + 120), 0.5, 1).gl(),
                    u_diffuse: textures[randInt(textures.length)],
                    u_specular: [1, 1, 1, 1],
                    u_shininess: rand(500),
                    u_specularFactor: rand(1),
                },
            });
        }

        requestAnimationFrame(drawScene);

        // Draw the scene.
        function drawScene(time) {
            time = time * 0.0001 + 5;

            webglUtils.resizeCanvasToDisplaySize(gl.canvas);

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            // Clear the canvas AND the depth buffer.
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            // Compute the projection matrix
            let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            let projectionMatrix =
                m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

            // Compute the camera's matrix using look at.
            let cameraPosition: Vector3 = [0, 0, 100];
            let target: Vector3 = [0, 0, 0];
            let up: Vector3 = [0, 1, 0];
            let cameraMatrix = m4.lookAt(cameraPosition, target, up, uniformsThatAreTheSameForAllObjects.u_viewInverse);

            // Make a view matrix from the camera matrix.
            let viewMatrix = m4.inverse(cameraMatrix);

            let viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

            gl.useProgram(program);

            // Setup all the needed attributes.
            webglUtils.setAttributes(attribSetters, attribs);

            // Bind the indices.
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

            // Set the uniforms that are the same for all objects.
            webglUtils.setUniforms(uniformSetters, uniformsThatAreTheSameForAllObjects);

            // Draw objects
            objects.forEach(function (object) {

                // Compute a position for this object based on the time.
                let worldMatrix = m4.xRotation(object.xRotation * time);
                worldMatrix = m4.yRotate(worldMatrix, object.yRotation * time);
                worldMatrix = m4.translate(worldMatrix, 0, 0, object.radius);
                uniformsThatAreComputedForEachObject.u_world = worldMatrix;

                // Multiply the matrices.
                m4.multiply(viewProjectionMatrix, worldMatrix, uniformsThatAreComputedForEachObject.u_worldViewProjection);
                m4.transpose(m4.inverse(worldMatrix), uniformsThatAreComputedForEachObject.u_worldInverseTranspose);

                // Set the uniforms we just computed
                webglUtils.setUniforms(uniformSetters, uniformsThatAreComputedForEachObject);

                // Set the uniforms that are specific to the this object.
                webglUtils.setUniforms(uniformSetters, object.materialUniforms);

                // Draw the geometry.
                gl.drawElements(gl.TRIANGLES, buffers.numElements, gl.UNSIGNED_SHORT, 0);
            });

            requestAnimationFrame(drawScene);
        }
    }

    main();
}