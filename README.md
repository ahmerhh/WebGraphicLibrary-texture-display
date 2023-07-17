# GL Texture Viewer

Display a WebGL texture using a convenient library for texture visualization. This is especially useful for visualizing the content of a [framebuffer object (FBO)](https://github.com/ahmerhh/WebGraphicLibrary_FixedBaseOperator).

## Installation

```sh
$ npm install --save @ahmerhh/WebGraphicLibrary-texture-display
Usage

js
Copy code
import TextureDisplay from '@ahmerhh/WebGraphicLibrary-texture-display';

// Set up WebGL context and texture

const display = new TextureDisplay(gl, texture);

// Call render in your rendering loop
display.render();
API

display = new TextureDisplay(gl, texture [, width, height, left, top])

Creates a new instance of the TextureDisplay class. The parameters are as follows:

gl: The WebGL context. For more information, refer to WebGL Context.
texture: The texture object to be displayed. For more information, refer to Texture.
width (default: 0.25), height (default: 0.25), left (default: 0.75), and top (default: 0) are all normalized values, with 1 representing fullscreen.
display.render([unit])

Renders the texture using the specified texture unit. The default unit is 0.

display.dispose()

Deletes the instance of the TextureDisplay class. The texture object remains intact.

License

This project is licensed under the MIT License. See LICENSE.md for more details.