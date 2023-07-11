import test from 'tape';
import getGl from '@ahmerhh/WebGraphicLibrary_Context';
import Texture from '@ahmerhh/WebGraphicLibrary_Texture';
import TextureDisplay from '../src';

const canvasElement = document.createElement('canvas');
const glContext = getGl(canvasElement);
const texture = new Texture(glContext, glContext.TEXTURE_2D, 512, 512);

test('should be instantiable', t => {
  t.plan(1);

  const textureDisplay = new TextureDisplay(glContext, texture);

  t.ok(textureDisplay instanceof TextureDisplay, 'TextureDisplay instance created');
});

test('should bind texture, program, and buffers when rendering', t => {
  t.plan(5);

  const textureDisplay = new TextureDisplay(glContext, texture);

  textureDisplay.render(1);

  t.equal(glContext.getParameter(glContext.ACTIVE_TEXTURE), glContext.TEXTURE1, 'Active texture is correct');
  t.equal(glContext.getParameter(glContext.TEXTURE_BINDING_2D), texture.texture, 'Texture binding is correct');
  t.equal(glContext.getParameter(glContext.CURRENT_PROGRAM), textureDisplay.program.program, 'Program is correct');
  t.equal(glContext.getParameter(glContext.ARRAY_BUFFER_BINDING), textureDisplay.planeUvsBuffer.buffer, 'Array buffer is correct');
  t.equal(glContext.getParameter(glContext.ELEMENT_ARRAY_BUFFER_BINDING), textureDisplay.planeFacesBuffer.buffer, 'Element buffer is correct');
});

test('should not delete texture when disposed', t => {
  t.plan(1);

  const textureDisplay = new TextureDisplay(glContext, texture);
  textureDisplay.dispose();

  t.ok(texture.texture, 'Texture still exists');
});

test.onFinish(window.close.bind(window));
