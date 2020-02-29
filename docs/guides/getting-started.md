<script src="../shader-sketch.js"></script>

# Prerequisites
There are a few prerequisites for working with shader-sketch:
- You should know how to work with HTML.
- You need a code editor to work in. If you don't have one, [codepen.io](https://codepen.io/) works well as an online code editor.
- It is highly recommended that you know GLSL (The language shader-sketch uses for its fragment shader code).

# Importing the shader-sketch library
In order to use shader-sketch, you need to import the JavaScript library into your webpage. To do this, you need to add a script tag to your HTML:

```html
...
<script src="https://cdn.jsdelivr.net/gh/ValgoBoi/shader-sketch@latest/dist/shader-sketch.js"></script>
...
```

If you are using an online editor such as [codepen.io](https://codepen.io/), there may also be an option to include scripts without putting them in your HTML. In this case, you can simply include this link: `https://cdn.jsdelivr.net/gh/ValgoBoi/shader-sketch@latest/dist/shader-sketch.js`

# Creating your first shader-sketch
In order to create a shader-sketch, you need to add a `<shader-sketch>` element to your HTML. Add this to your HTML:

```html
<shader-sketch>
    <fragment-shader>
        void main() {
            gl_FragColor = vec4(gl_FragCoord.xy / viewportSize, 0., 1.);
        }
    </fragment-shader>
</shader-sketch>
```
<shader-sketch>
    <fragment-shader>
        void main() {
            gl_FragColor = vec4(gl_FragCoord.xy / viewportSize, 0., 1.);
        }
    </fragment-shader>
</shader-sketch>

When the page loads, there should be a black, red, green, and yellow square on your website. If there is, you have set everything up correctly!

# Editing the fragment-shader code
You will see that there is an element inside of your shader-sketch called `<fragment-shader>`. This contains the GLSL code that runs on the GPU. The code in this element will run *once for every pixel on your canvas, every frame*. This means that this code is running hundreds of thousands, or even millions of times per second. This is all done on the GPU, so it runs fine (unless you write some intensive code).

Edit your `<fragment-shader>` to look like this:

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

You just modified the shader-sketch! Upon reloading, the square should change color smoothly. You see, changing the code inside of the `<fragment-shader>` tag changes what the shader-sketch looks like. You can write any valid GLSL code in this tag, and it will show up on the webpage!

# Next steps
- If you aren't familiar with GLSL, you should learn it. GLSL is essentially a requirement for working with shader-sketch.
- If you want to know more of the theory about how to create shaders, [The Book of Shaders](https://thebookofshaders.com/) is an amazing website on how to write interestinng shaders. It includes techniques that will be very useful to you, working with shader-sketch.

## Next: [Using Uniforms](guides/using-uniforms)