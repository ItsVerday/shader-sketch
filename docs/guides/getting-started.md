<script src="../../dist/shader-sketch.js"></script>

<shader-sketch>
    <fragment-shader>
        void main() {
            gl_FragColor = vec4(gl_FragCoord.xy / viewportSize, 0., 1.);
        }
    </fragment-shader>
</shader-sketch>