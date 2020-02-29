# Prerequisites
There are a few prerequisites for working with uniforms:
- You should know how to work with HTML.
- You need a code editor to work in. If you don't have one, [codepen.io](https://codepen.io/) works well as an online code editor.
- It is highly recommended that you know GLSL (The language shader-sketch uses for its fragment shader code).
- You should know the basics of shader-sketch (check out the [Getting Started](guides/getting-started) guide if you don't).

# What is a Uniform?
To understand what a Uniform is, we need to go back to how the shader-sketch runs its code. Consider this example:

```html
<shader-sketch>
    <fragment-shader>
        void main() {
            gl_FragColor = vec4(gl_FragCoord.xy / viewportSize, map(sin(timeElapsed), -1., 1., 0., 1.), 1.);
        }
    </fragment-shader>
</shader-sketch>
```
<shader-sketch>
    <fragment-shader>
        void main() {
            gl_FragColor = vec4(gl_FragCoord.xy / viewportSize, map(sin(timeElapsed), -1., 1., 0., 1.), 1.);
        }
    </fragment-shader>
</shader-sketch>

The code that is run is the text inside of the `<fragment-shader>` tag. This code is GLSL, which is used to write shaders. As mentioned in the previous example, this code will run *once for every pixel on your canvas, every frame*. This program essentially calculates the color of each pixel.
As of now, this process is shut off from our main web page. In other words, we aren't transfering data to the shader to do anything. Unless we can do this, there is no easy way to interact with or dynamically affect our shaders.
This is exactly what a uniform is for. A uniform transfers some data (an integer, float, or vector) from our webpage to our shader program. We can define as many uniforms as we want (well, not really, there is a limit, but you probably won't ever reach it), and use them to create parameters for our shader. In fact, Shader-Sketch has a few built in uniforms.

# Using Uniforms
Uniforms work similar to other variables, except they can't be modified from the shader program. They can be used in expressions, though. When you add a uniform, you don't need to add anything to your `<fragment-shader>` code. Shader-Sketch will automatically add the uniform declaration to your code upon loading, and the uniform will be set automatically.

For example, say we have a uniform called myNumber, which is of the datatype float. We have this code:

```html
<shader-sketch>
    <fragment-shader>
        void main() {
            gl_FragColor = vec4(myNumber, myNumber, myNumber, 1.);
        }
    </fragment-shader>

    <!-- This is how you add your own uniforms! This will be discussed later in this tutorial. -->
    <shader-uniform name="myNumber" type="float" value="0.5"></shader-uniform>
</shader-sketch>
```

Shader-Sketch will preprocess your fragment-shader into this:
```html
<fragment-shader>
    uniform float myNumber;

    void main() {
        gl_FragColor = vec4(myNumber, myNumber, myNumber, 1.);
    }
</fragment-shader>
```

Cool, right? Shader-Sketch takes care of the nitty-gritty details for you!

# Built-in Uniforms
Shader-Sketch has several built in uniforms, which can be used in your own shaders.

## `vec2` viewportSize
Represents the size of the canvas (viewport). `viewportSize.x` is the width of the viewport, and `viewportSize.y` is the height of the viewport.
The `viewportSize` is often used to calculate the normalized coordinates on the screen, like so:

```glsl
vec2 normalizedCoords = gl_FragCoord.xy / viewportSize;
```

## `float` timeElapsed
Represents the amount of time (in seconds) that has elasped since the shader-sketch was initialized. You can use this value to animate your shader-sketch.

## `int` frameCount
Represents the amount of frames that have been rendered since the shader-sketch was initialized. This uniform shouldn't be used as a time value, because the shader-sketch running at a different fps will affect the speed that this value goes up.

## `vec2` mousePosition
Represents the mouse position on the shader-sketch element. `mousePosition.x` is the x position of the mouse, and `mousePosition.y` is the y position.
The `mousePosition` can be normalized like so:

```glsl
vec2 normalizedMousePosition = mousePosition / viewportSize;
```

## `int` mouseState
Represents the state of the mouse:
- `0` = not pressed
- `1` = pressed

# Creating your own uniforms
To create your own uniforms, you must add a child element to your `<shader-sketch>` in your HTML:

```html
<shader-uniform name="uniform_name" type="uniform type (int, float vec2, vec3, vec4, etc...)" value="value or a [list, of, values]"></shader-uniform>
```

This will create a uniform for your shader-sketch.
These are all valid uniform declarations:

```html
<shader-uniform name="clickCount" type="int" value="0"></shader-uniform>
<shader-uniform name="surfaceColor" type="vec4" value="[1, 0.5, 0, 1]"></shader-uniform>
<shader-uniform name="position" type="vec2" value="5, 3"></shader-uniform>
```

What if you want to update the value of your uniform? For this, you will need JavaScript:

```js
// Get a reference to your shader-sketch element
let shaderSketch = document.getElementById("shader-sketch");

// Set the uniform value
shaderSketch.setUniform("uniform_name", uniform_value);

// For example,
shaderSketch.setUniform("clickCount", clickCount++);
shaderSketch.setUniform("surfaceColor", [0, 0.5, 1, 1]);
shaderSketch.setUniform("position", -3, -1);
```

This will update the values of these uniforms, and your shader-sketch will update accordingly.

# Next steps
- Become more familiar with uniforms. Use them to make your shader-sketch more flexible, or just to easily change a parameter.
- Find interesting ways to use uniforms. What if you could use the arrow keys to move around in the shader-sketch? What if scrolling affected the shader-sketch?

## Previous: [Getting Started](guides/getting-started)