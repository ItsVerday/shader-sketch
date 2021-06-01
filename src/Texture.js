import ShaderSketchElement from "./ShaderSketchElement";
import Uniform from "./Uniform";

class Texture {
    constructor(name, image, { blending = "linear", wrapping = "clamp", update = false } = {}) {
        this.name = name;
        this.image = image;

        if (this.image instanceof ShaderSketchElement) {
            this.image = this.image.shaderSketch.buffer;
        }

        this.blending = blending || "linear";
        this.wrapping = wrapping || "clamp";
        this.shouldUpdate = update || false;

        this.resolutionUniform = new Uniform(`${this.name}_resolution`, "vec2", this.image.width, this.image.height);

        this.uniforms = [
            this.resolutionUniform
        ];
    }

    update(gl) {
        this.resolutionUniform.setValue(this.image.width, this.image.height);

        if (this.shouldUpdate) {
            this.bindTexture(gl);
        }
    }

    getUniformDeclaration() {
        return `uniform sampler2D ${this.name};`;
    }

    loadUniformLocation(gl, program) {
        this.location = gl.getUniformLocation(program, this.name);
    }

    bindTexture(gl) {
        this.unbindTexture(gl);
        this.texture = gl.createTexture();

        {
            const level = 0;
            const internalFormat = gl.RGBA;
            const srcFormat = gl.RGBA;
            const srcType = gl.UNSIGNED_BYTE;

            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, this.image);

            let blending, wrapping;

            switch (this.blending.toLowerCase()) {
                case "linear":
                    blending = gl.LINEAR;
                    break;
                case "nearest":
                    blending = gl.NEAREST;
                    break;
            }

            switch (this.wrapping.toLowerCase()) {
                case "repeat":
                    wrapping = gl.REPEAT;
                    break;
                case "clamp":
                    wrapping = gl.CLAMP_TO_EDGE;
                    break;
                case "mirror":
                    wrapping = gl.MIRRORED_REPEAT;
                    break;
            }

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, blending);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapping);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapping);
        }
    }

    unbindTexture(gl) {
        if (!this.texture) {
            return;
        }
        
        gl.deleteTexture(this.texture);
    }
    
    loadUniformLocation(gl, program) {
        this.location = gl.getUniformLocation(program, this.name);
    }
}

export default Texture;