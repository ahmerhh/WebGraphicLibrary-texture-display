import getPlaneGeometry from '@ahmerhh/WebGraphicLibrary_geo-plane';
// import Program from '@ahmerhh/gl-program';
// import Buffer from '@ahmerhh/gl-buffer';

/**
 * @class TextureDisplay
 */
export default class TextureDisplay {
  /**
   * @constructs TextureDisplay
   * @param {WebGLRenderingContext} gl
   * @param {Texture} texture
   * @param {float} [width = 0.25]
   * @param {float} [height = 0.25]
   * @param {float} [left = 0.75]
   * @param {float} [top = 0]
   */
  constructor(gl, texture, width = 0.25, height = 0.25, left = 0, top = 0) {
    this.gl = gl;
    this.texture = texture;

    this.program = new Program(gl,
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

    this.program.addAttribute('aPosition', 3, gl.FLOAT);
    this.program.addAttribute('aUv', 2, gl.FLOAT);
    this.program.addUniform('uTexture', gl.INT);

    const planeWidth = 2 * width;
    const planeHeight = 2 * height;

    const planeGeometry = getPlaneGeometry(planeWidth, planeHeight);

    const planeOffsetLeft = (1 - (planeWidth / 2)) - (2 * left);
    const planeOffsetTop = 1 - (planeHeight / 2) - (2 * top);

    for(let i = 0; i < planeGeometry.verts.length; i += 3) {
      planeGeometry.verts[i] -= planeOffsetLeft;
      planeGeometry.verts[i + 1] += planeOffsetTop;
    }

    this.planeVerticesBuffer = new Buffer(gl, gl.ARRAY_BUFFER, planeGeometry.verts);
    this.planeUvsBuffer = new Buffer(gl, gl.ARRAY_BUFFER, planeGeometry.uvs);
    this.planeFacesBuffer = new Buffer(gl, gl.ELEMENT_ARRAY_BUFFER, planeGeometry.faces);
  }

  /**
   * @method render
   * @public
   * @param {uint} [unit = 0]
   */
  render(unit = 0) {
    this.program.bind();
    this.planeVerticesBuffer.bind();
    this.program.setAttributePointer('aPosition');
    this.planeUvsBuffer.bind();
    this.program.setAttributePointer('aUv');
    this.planeFacesBuffer.bind();
    
    this.program.setUniform('uTexture', this.texture.bind(unit));

    this.gl.drawElements(this.gl.TRIANGLES, this.planeFacesBuffer.length, this.gl.UNSIGNED_SHORT, 0);
  }

  /**
   * @method dispose
   * @public
   */
  dispose() {
    this.program.dispose();
    this.planeVerticesBuffer.dispose();
    this.planeUvsBuffer.dispose();
    this.planeFacesBuffer.dispose();
  }
}