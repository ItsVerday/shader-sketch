import ShaderSketch from "./ShaderSketch";

const STYLE =
`:host {
	position: relative;
	display: inline-block;
	width: 250px;
	height: 250px;
}

:host > canvas {
	position: absolute;
	top: 0;
	left: 0;
}`;

class ShaderSketchElement extends HTMLElement {
    constructor() {
        super();
        
        this.shadow = this.attachShadow({ mode: "open" });
        
        this.styleElt = document.createElement("style");
        this.styleElt.textContent = STYLE;
        
        this.canvasElt = document.createElement("canvas");
        
        this.shadow.appendChild(this.styleElt);
        this.shadow.appendChild(this.canvasElt);

        this.mounted = false;
        
        this.fragmentShaderElt = null;
    }
    
    getMousePosition(evt) {
        return [
            evt.x - this.rect.x,
            this.height - evt.y + this.rect.y
        ];
    }
    
    connectedCallback() {
        this.mounted = true;
        this.shaderSketch = new ShaderSketch(this);
        
        this.onmousedown = evt => {
            this.setUniform("mousePosition", this.getMousePosition(evt));
            this.setUniform("mouseState", 1);
        };
        
        this.onmousemove = evt => {
            this.setUniform("mousePosition", this.getMousePosition(evt));
        };
        
        this.onmouseup = evt => {
            this.setUniform("mousePosition", this.getMousePosition(evt));
            this.setUniform("mouseState", 0);
        };

        this.updateChildren();
        
        this.render();
    }
    
    disconnectedCallback() {
        this.mounted = false;
        this.shaderSketch = null;
        
        this.onmousedown = null;
        this.onmousemove = null;			
        this.onmouseup = null;
    }
    
    updateChildren() {
        this.fragmentShaderElt = null;

        let imports = [];
        
        for (let child of this.childNodes) {
            let tagName = child.tagName;

            if (tagName == "FRAGMENT-SHADER") {
                this.fragmentShaderElt = child;
            }
            
            if (tagName == "SHADER-UNIFORM") {
                let name = child.getAttribute("name");
                let type = child.getAttribute("type");
                let value = child.getAttribute("value");
                
                if (this.getUniform(name) == null) {
                    this.addUniform(name, type, value);
                } else {
                    this.setUniform(name, value);
                }
            }

            if (tagName == "SHADER-IMPORT") {
                let name = child.getAttribute("name");
                imports.push(name);
            }
        }
        
        this.shaderSketch.shouldCompileProgram = true;
        this.shaderSketch.imports = imports;
    }
    
    render() {
        if (this.mounted) {
            requestAnimationFrame(() => {
                this.render();
            });
        }
        
        this.updateSize();
        
        this.shaderSketch.render();
    }
    
    updateSize() {
        this.rect = this.getBoundingClientRect();
        let { width, height } = this.rect;
        
        let { width: oldWidth, height: oldHeight } = this;

        if (width == oldWidth && height == oldHeight) {
            return;
        }

        this.width = width;
        this.height = height;

        this.canvasElt.width = width;
        this.canvasElt.style.width = width >= 1 ? width : 1;
        this.canvasElt.height = height;
        this.canvasElt.style.height = height >= 1 ? height : 1;
            
        this.shaderSketch.gl.viewport(0, 0, width, height);
        
        this.setUniform("viewportSize", width, height);
    }
    
    addUniform(...args) {
        this.shaderSketch.addUniform(...args);
    }
    
    getUniform(...args) {
        return this.shaderSketch.getUniform(...args);
    }
    
    setUniform(...args) {
        this.shaderSketch.setUniform(...args);
    }
}

export default ShaderSketchElement;