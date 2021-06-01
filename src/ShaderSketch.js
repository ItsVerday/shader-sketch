import Uniform from "./Uniform";
import Utils from "./Utils";
import Import from "./Imports";
import Texture from "./Texture";

const DEFAULT_VERTEX_SHADER =
`attribute vec4 position;

void main() {
	gl_Position = position;
}`;
	
const DEFAULT_FRAGMENT_SHADER =
`void main() {
	gl_FragColor = vec4(gl_FragCoord.xy / viewportSize, 0., 1.);
}`;

const TEXTURE_NAMES = [ "TEXTURE0", "TEXTURE1", "TEXTURE2", "TEXTURE3", "TEXTURE4", "TEXTURE5", "TEXTURE6", "TEXTURE7" ];

class ShaderSketch {
    constructor(element) {
        this.element = element;
        this.buffer = document.createElement("canvas");
        this.buffer.style.display = "none";
        this.bufferCtx = this.buffer.getContext("2d");
        this.gl = element.canvasElt.getContext("webgl", { preserveDrawingBuffer: true });
        
        this.uniforms = [];
        this.textures = [];
        this.imports = ["__global__"];
        
        this.program = null;
        this.shouldCompileProgram = true;
        
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([ -1, -1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1 ]), this.gl.STATIC_DRAW);
        
        this.addUniform("viewportSize", "vec2", 0, 0);
        
        this.frameCount = 0;
        this.addUniform("frameCount", "int", 0);
        
        this.startTime = new Date();
        this.addUniform("timeElapsed", "float", 0);
        
        this.addUniform("mousePosition", "vec2", 0, 0);
        this.addUniform("mouseState", "int", 0);
    }
    
    getExtraFragmentCode() {
        let code = `precision highp float;`;
        for (let uniform of this.getUniforms()) {
            code += `
${uniform.getUniformDeclaration()}`;
        }

        for (let texture of this.textures) {
            code += `
${texture.getUniformDeclaration()}`;
        }

        code += "\n" + Import.resolveCode(this.imports.map(name => Import.getImport(name)));

        return code;
    }

    compileProgram() {
        this.shouldCompileProgram = false;
        
        let fragmentShader = DEFAULT_FRAGMENT_SHADER;
        
        if (this.element.fragmentShaderElt != null) {
            fragmentShader = this.element.fragmentShaderElt.textContent;
        }
        
        fragmentShader = this.getExtraFragmentCode() + "\n" + fragmentShader;

        this.program = Utils.initShaderProgram(this.gl, DEFAULT_VERTEX_SHADER, fragmentShader);
        
        if (this.program == null) {
            return;
        }

        for (let uniform of this.getUniforms()) {
            uniform.loadUniformLocation(this.gl, this.program);
        }

        for (let texture of this.textures) {
            texture.loadUniformLocation(this.gl, this.program);
        }
    }
    
    canRender() {
        if (this.program == null) {
            return false;
        }
        
        return true;
    }
    
    render() {
        if (this.shouldCompileProgram) {
            this.compileProgram();
        }
        
        if (!this.canRender()) {
            return;
        }

        this.bufferCtx.clearRect(0, 0, this.buffer.width, this.buffer.height)
        this.bufferCtx.drawImage(this.element.canvasElt, 0, 0);
        
        this.frameCount++;
        this.setUniform("frameCount", this.frameCount);
        this.setUniform("timeElapsed", (new Date() - this.startTime) / 1000);

        this.gl.useProgram(this.program);

        this.bindTextures();
        
        for (let uniform of this.getUniforms()) {
            uniform.setUniformValue(this.gl);
        }

        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        {
            const numComponents = 2;
            const type = this.gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;

            const location = this.gl.getAttribLocation(this.program, "position");

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
            this.gl.vertexAttribPointer(location, numComponents, type, normalize, stride, offset);
            this.gl.enableVertexAttribArray(location);
        }
        
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        this.bufferCtx.clearRect(0, 0, this.buffer.width, this.buffer.height)
        this.bufferCtx.drawImage(this.element.canvasElt, 0, 0);
    }

    bindTextures() {
        let textureNumber = 0;
        
        for (let texture of this.textures) {
            if (textureNumber >= TEXTURE_NAMES.length) {
                break;
            }

            let textureName = this.gl[TEXTURE_NAMES[textureNumber]];

            this.gl.activeTexture(textureName);
            texture.update(this.gl);
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture.texture);
            this.gl.uniform1i(texture.location, textureNumber);
            textureNumber++;
        }
    }

    getUniforms() {
        let uniforms = this.uniforms;

        for (let texture of this.textures) {
            uniforms = [...uniforms, ...texture.uniforms];
        }

        return uniforms;
    }
    
    addUniform(name, type, ...values) {
        this.uniforms.push(new Uniform(name, type, ...values));
        
        this.shouldCompileProgram = true;
    }
    
    getUniform(name) {
        for (let uniform of this.getUniforms()) {
            if (uniform.name == name) {
                return uniform;
            }
        }
        
        return null;
    }
    
    setUniform(name, ...values) {
        let uniform = this.getUniform(name);
        
        if (uniform != null) {
            uniform.setValue(...values);
        }
    }

    addTexture(...args) {
        let texture = new Texture(...args);
        texture.bindTexture(this.gl);

        this.textures.push(texture);
    }

    getTexture(name) {
        for (let texture of this.textures) {
            if (texture.name == name) {
                return texture;
            }
        }

        return null;
    }

    deleteTexture(name) {
        let texture = this.getTexture(name);
        
        if (texture != null) {
            texture.unbindTexture(this.gl);
            this.textures.splice(this.textures.indexOf(texture), 1);
        }
    }
}

export default ShaderSketch;