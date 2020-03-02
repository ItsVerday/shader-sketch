<script src="../shader-sketch.js"></script>

# Prerequisites
There are a few prerequisites for working with imports:
- You should know how to work with HTML.
- You need a code editor to work in. If you don't have one, [codepen.io](https://codepen.io/) works well as an online code editor.
- It is highly recommended that you know GLSL (The language shader-sketch uses for its fragment shader code).
- You should know the basics of shader-sketch (check out the [Getting Started](guides/getting-started) guide if you don't).

# A note on shaders
Often times, in order to create interesting shader-sketches, you will need to use some sort of advanced code that you don't know how to write youself. An excellent example of this is *noise*. A noise function takes in a position, and produces a "random" value based on that position. The key thing is in a noise function, positions close to each other will always return values close to each other.

As you might expect, a noise function is quite complicated, and requires some advanced mathematical knowledge. Because of this, you wouldn't want to write your own noise function. Instead, it is best to use one that someone else (who knows more about the topic) wrote for others to use.

Many programmers will turn to Google to find a pre-written noise function. They may find a GitHub gist or a StackOverflow question about it, and copy-paste the provided code into their own code. This can be a bit annoying, though. This is why shader-sketch provides imports.

# What is a shader-sketch import?
An import in shader-sketch is a set of GLSL code that serves some purpose. There are imports for noise functions, color conversions, and some other useful things.

It is easy to include an import in your shader-sketch. Simply add the following tag inside of your `<shader-sketch>` element:

```html
<shader-import name="import_name"></shader-import>
```

For example, if you wanted to import 2D perlin noise (a type of noise):

```html
<shader-import name="perlin_noise_2d"></shader-import>
```

This will automatically add the `perlin_noise_2d` code into your shader-sketch, allowing you to use a few related functions in your shader-sketch.

This allows you to create this:
```html
<shader-sketch>
    <fragment-shader>
        void main() {
            vec2 position = gl_FragCoord.xy / viewportSize;
            position /= 10.;

            float noise = perlin_noise_2d(position);

            gl_FragColor = vec4(noise, noise, noise, 1.);
        }
    </fragment-shader>

    <shader-import name="perlin_noise_2d"></shader-import>
</shader-sketch>
```
<shader-sketch>
    <fragment-shader>
        void main() {
            vec2 position = gl_FragCoord.xy / viewportSize;
            position /= 10.;

            float noise = perlin_noise_2d(position);

            gl_FragColor = vec4(noise, noise, noise, 1.);
        }
    </fragment-shader>

    <shader-import name="perlin_noise_2d"></shader-import>
</shader-sketch>

The [List of Imports](../docs/imports) page lists all of the available imports in shader-sketch.

# Next steps
- Check out the [List of Imports](../docs/imports) page for all the cool imports you can use.
- Find interesting ways to use or combine imports.

## Previous: [Using Uniforms](using-uniforms)
