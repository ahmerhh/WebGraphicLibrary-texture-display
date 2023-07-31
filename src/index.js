import getPlaneGeometry from '@ahmerhh/WebGraphicLibrary-geo-plane';
import Program from '@ahmerhh/WebGraphicLibrary-program';
import Buffer from '@ahmerhh/WebGraphicLibrary-buffer';

/**
 * @class TextureDisplay
 * Represents a textured display in WebGL.
 */
export default class TextureDisplay {
  /**
   * @constructs TextureDisplay
   * @param {WebGLRenderingContext} gl - The WebGL context.
   * @param {Texture} texture - The texture to be displayed on the plane.
   * @param {float} [width = 0.25] - The width of the plane (0.0 to 1.0).
   * @param {float} [height = 0.25] - The height of the plane (0.0 to 1.0).
   * @param {float} [left = 0] - The left offset of the plane (-1.0 to 1.0).
   * @param {float} [top = 0] - The top offset of the plane (-1.0 to 1.0).
   */
  constructor(gl, texture, width = 0.25, height = 0.25, left = 0, top = 0) {
    this.gl = gl;
    this.texture = texture;

    // Create a simple program to render the textured plane
    this.program = new Program(
      gl,
      `
      attribute vec3 aPosition;
      attribute vec2 aUv;

      varying vec2 vUv;

      void main() {
        vUv = aUv;
        gl_Position = vec4(aPosition, 1.0);
      }
      `,
      `
      precision mediump float;

      uniform sampler2D uTexture;

      varying vec2 vUv;

      void main() {
        gl_FragColor = texture2D(uTexture, vUv);
      }
      `
    );

    // Add attributes and uniforms for the program
    this.program.addAttribute('aPosition', 3, gl.FLOAT);
    this.program.addAttribute('aUv', 2, gl.FLOAT);
    this.program.addUniform('uTexture', gl.INT);

    // Calculate plane dimensions and offsets
    const planeWidth = 2 * width;
    const planeHeight = 2 * height;
    const planeGeometry = getPlaneGeometry(planeWidth, planeHeight);
    const planeOffsetLeft = (1 - (planeWidth / 2)) - (2 * left);
    const planeOffsetTop = 1 - (planeHeight / 2) - (2 * top);

    // Apply offsets to plane vertices
    for (let i = 0; i < planeGeometry.verts.length; i += 3) {
      planeGeometry.verts[i] -= planeOffsetLeft;
      planeGeometry.verts[i + 1] += planeOffsetTop;
    }

    // Create buffers for plane vertices, UVs, and faces
    this.planeVerticesBuffer = new Buffer(gl, gl.ARRAY_BUFFER, planeGeometry.verts);
    this.planeUvsBuffer = new Buffer(gl, gl.ARRAY_BUFFER, planeGeometry.uvs);
    this.planeFacesBuffer = new Buffer(gl, gl.ELEMENT_ARRAY_BUFFER, planeGeometry.faces);
  }

  /**
   * @method render
   * @public
   * Renders the textured plane with the specified texture unit.
   * @param {uint} [unit = 0] - The texture unit to bind the texture to.
   */
  render(unit = 0) {
    this.program.bind();
    this.planeVerticesBuffer.bind();
    this.program.setAttributePointer('aPosition');
    this.planeUvsBuffer.bind();
    this.program.setAttributePointer('aUv');
    this.planeFacesBuffer.bind();

    // Bind the texture to the specified texture unit
    this.program.setUniform('uTexture', this.texture.bind(unit));

    this.gl.drawElements(this.gl.TRIANGLES, this.planeFacesBuffer.length, this.gl.UNSIGNED_SHORT, 0);
  }

  /**
   * @method dispose
   * @public
   * Disposes of the WebGL resources used by the TextureDisplay instance.
   */
  dispose() {
    this.program.dispose();
    this.planeVerticesBuffer.dispose();
    this.planeUvsBuffer.dispose();
    this.planeFacesBuffer.dispose();
  }
}
