import Uniform from "./Uniform";
import Utils from "./Utils";
import Import from "./Imports";

const DEFAULT_VERTEX_SHADER =
`attribute vec2 position;

void main() {
	gl_Position = vec4(position, 0., 0.);
}`;
	
const DEFAULT_FRAGMENT_SHADER =
`void main() {
	gl_FragColor = vec4(gl_FragCoord.xy / viewportSize, 0., 1.);
}`;

class ShaderSketch {
    constructor(element) {
        this.element = element;
        this.gl = element.canvasElt.getContext("webgl");
        
        this.uniforms = [];
        this.imports = [];
        
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
        for (let uniform of this.uniforms) {
            code += `
${uniform.getUniformDeclaration()}`;
        }

        code += Import.resolveCode(this.imports.map(name => Import.getImport(name)));
        
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
        
        for (let uniform of this.uniforms) {
            uniform.loadUniformLocation(this.gl, this.program);
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
        
        this.frameCount++;
        this.setUniform("frameCount", this.frameCount);
        this.setUniform("timeElapsed", (new Date() - this.startTime) / 1000);
        
        for (let uniform of this.uniforms) {
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

            const location = this.gl.getAttribLocation(this.program, 'position');

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
            this.gl.vertexAttribPointer(location, numComponents, type, normalize, stride, offset);
            this.gl.enableVertexAttribArray(location);
        }
        
        this.gl.useProgram(this.program);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
    
    addUniform(name, type, ...values) {
        this.uniforms.push(new Uniform(name, type, ...values));
        
        this.shouldCompileProgram = true;
    }
    
    getUniform(name) {
        for (let uniform of this.uniforms) {
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
}

export default ShaderSketch;