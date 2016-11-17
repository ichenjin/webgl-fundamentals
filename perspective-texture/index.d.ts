/// <reference path="../scripts/typings/jquery/jquery.d.ts" />

declare interface webglUtils {
    /**
     * Creates a program from 2 script tags.
     *
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext
     *        to use.
     * @param {string[]} shaderScriptIds Array of ids of the script
     *        tags for the shaders. The first is assumed to be the
     *        vertex shader, the second the fragment shader.
     * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
     * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
     * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors. By default it just prints an error to the console
     *        on error. If you want something else pass an callback. It's passed an error message.
     * @return {WebGLProgram} The created program.
     * @memberOf module:webgl-utils
     */
    createProgramFromScripts(gl: WebGLRenderingContext, shaderScriptIds: Array<string>,
        opt_attribs?: any, opt_locations?: any, opt_errorCallback?: Function): WebGLProgram;

    /**
     * Resize a canvas to match the size its displayed.
     * @param {HTMLCanvasElement} canvas The canvas to resize.
     * @param {number} [multiplier] amount to multiply by.
     *    Pass in window.devicePixelRatio for native pixels.
     * @return {boolean} true if the canvas was resized.
     * @memberOf module:webgl-utils
     */
    resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, multiplier?: number): void;
}
declare const webglUtils: webglUtils;

declare interface webglLessonsHelper {
    showNeedWebGL(canvas: HTMLCanvasElement): void;
    setupLesson(canvas: HTMLCanvasElement, opt_options?: any): void;
    setupSlider(selector: string, options?: any): void;
}
declare const webglLessonsHelper: webglLessonsHelper;

declare interface HTMLCanvasElement {
    getContext(contextId: "webgl"): WebGLRenderingContext;
}

declare interface Matrix3 extends ArrayLike<number> {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
}

declare interface m3 {
    multiply(a: Matrix3, b: Matrix3): Matrix3;
    identity(): Matrix3;
    projection(width: number, height: number): Matrix3;
    project(m: Matrix3, width: number, height: number): Matrix3;
    translation(tx: number, ty: number): Matrix3;
    translate(m: Matrix3, tx: number, ty: number): Matrix3;
    rotation(angleInRadians: number): Matrix3;
    rotate(m: Matrix3, angleInRadians: number): Matrix3;
    scaling(sx: number, sy: number): Matrix3;
    scale(m: Matrix3, sx: number, sy: number): Matrix3;
    dot(x1: number, y1: number, x2: number, y2: number): number;
    distance(x1: number, y1: number, x2: number, y2: number): number;
    normalize(x: number, y: number): Array<number>;
    reflect(ix: number, iy: number, nx: number, ny: number): Array<number>;
    radToDeg(r: number): number;
    degToRad(r: number): number;
}

declare const m3: m3;

declare interface Vector3 extends ArrayLike<number> {
    0: number;
    1: number;
    2: number;
}

declare interface Vector4 extends ArrayLike<number> {
    0: number;
    1: number;
    2: number;
    3: number;
}

declare interface Matrix4 extends ArrayLike<number> {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
    11: number;
    12: number;
    13: number;
    14: number;
    15: number;
}

declare interface m4 {
    multiply(a: Matrix4, b: Matrix4, dst?: Matrix4): Matrix4;
    subtractVectors(a: Vector3, b: Vector3, dst?: Vector3): Vector3;
    normalize(v: Vector3, dst?: Vector3): Vector3;
    cross(a: Vector3, b: Vector3, dst?: Vector3): Vector3;
    identity(dst?: Matrix4): Matrix4;
    transpose(m: Matrix4, dst?: Matrix4): Matrix4;
    lookAt(cameraPosition: Vector3, target: Vector3, up: Vector3, dst?: Matrix4): Matrix4;
    perspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number, dst?: Matrix4): Matrix4;
    orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number, dst?: Matrix4): Matrix4;
    frustum(left: number, right: number, bottom: number, top: number, near: number, far: number, dst?: Matrix4): Matrix4;
    translation(tx: number, ty: number, tz: number, dst?: Matrix4): Matrix4;
    translate(m: Matrix4, tx: number, ty: number, tz: number, dst?: Matrix4): Matrix4;
    xRotation(angleInRadians: number, dst?: Matrix4): Matrix4;
    xRotate(m: Matrix4, angleInRadians: number, dst?: Matrix4): Matrix4;
    yRotation(angleInRadians: number, dst?: Matrix4): Matrix4;
    yRotate(m: Matrix4, angleInRadians: number, dst?: Matrix4): Matrix4;
    zRotation(angleInRadians: number, dst?: Matrix4): Matrix4;
    zRotate(m: Matrix4, angleInRadians: number, dst?: Matrix4): Matrix4;
    axisRotation(axis: Vector3, angleInRadians: number, dst?: Matrix4): Matrix4;
    axisRotate(m: Matrix4, axis: Vector3, angleInRadians: number, dst?: Matrix4): Matrix4;
    scaling(sx: number, sy: number, sz: number, dst?: Matrix4): Matrix4;
    scale(m: Matrix4, sx: number, sy: number, sz: number, dst?: Matrix4): Matrix4;
    inverse(m: Matrix4, dst?: Matrix4): Matrix4;
    transformVector(m: Matrix4, v: Vector4, dst?: Vector4): Vector4;
    transformPoint(m: Matrix4, v: Vector3, dst?: Vector4): Vector4;
    transformDirection(m: Matrix4, v: Vector3, dst?: Vector4): Vector4;
    transformNormal(m: Matrix4, v: Vector3, dst?: Vector3): Vector3
    copy(src: Matrix4, dst?: Matrix4);
}

declare const m4: m4;