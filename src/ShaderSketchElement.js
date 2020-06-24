import ShaderSketch from "./ShaderSketch";
import Utils from "./Utils";
import UpdateParentElement from "./UpdateParentElement";

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
        this.loadingTextures = [];
        
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

        for (let child of this.childNodes) {
            if (child instanceof UpdateParentElement) {
                child.update(this);
            }
        }
        
        this.render();
    }
    
    disconnectedCallback() {
        this.mounted = false;
        this.shaderSketch = null;
        
        this.onmousedown = null;
        this.onmousemove = null;			
        this.onmouseup = null;
    }
    
    updateChild({ child, add }) {
        switch (child.tagName.toLowerCase()) {
            case "fragment-shader":
                this.fragmentShaderElt = add ? child : null;
                break;
            
            case "shader-uniform":
                if (!add) {
                    break;
                }
                
                {
                    let name = child.getAttribute("name");
                    let type = child.getAttribute("type");
                    let value = child.getAttribute("value");
                    
                    if (this.getUniform(name) == null) {
                        this.addUniform(name, type, value);
                    } else {
                        this.setUniform(name, value);
                    }
                }

                break;
            
            case "shader-import":
                {
                    let name = child.getAttribute("name");

                    if (add) {
                        this.shaderSketch.imports.push(name);
                    } else {
                        this.shaderSketch.imports.splice(this.shaderSketch.imports.indexOf(name), -1);
                    }
                }

                break;
            
            case "shader-texture":
                {
                    let name = child.getAttribute("name");
                    let src = child.getAttribute("src");
                    let blending = child.getAttribute("blending");
                    let wrapping = child.getAttribute("wrapping");

                    if (add) {
                        if (this.shaderSketch.getTexture(name) == null && this.loadingTextures.indexOf(name) == -1) {
                            this.loadingTextures.push(name);

                            const image = new Image();
                            image.onload = () => {
                                this.addTexture(name, image, { blending, wrapping, update: false });
                            }

                            image.src = src;
                        }
                    } else {
                        this.shaderSketch.deleteTexture(name);
                    }
                }

                break;

            case "shader-canvas-texture":
                {
                    let name = child.getAttribute("name");
                    let selector = child.getAttribute("selector");
                    let blending = child.getAttribute("blending");
                    let wrapping = child.getAttribute("wrapping");

                    if (add) {
                        let elt = document.querySelector(selector);

                        if (elt == null) {
                            break;
                        }

                        if (elt.tagName.toLowerCase() == "shader-sketch") {
                            elt = elt.canvasElt;
                        }

                        this.addTexture(name, elt, { blending, wrapping, update: true });
                    } else {
                        this.shaderSketch.deleteTexture(name);
                    }
                }

                break;
            case "shader-typography":
                {
                    let name = child.getAttribute("name");
                    let text = child.textContent;
                    let fontSize = parseFloat(child.getAttribute("font-size")) ?? 24;
                    let fontFamily = child.getAttribute("font-family") ?? "sans-serif";
                    let fontStyle = child.getAttribute("font-style") ?? "normal";
                    let fontWeight = child.getAttribute("font-weight") ?? "normal";
                    let textWrap = parseFloat(child.getAttribute("text-wrap")) ?? Infinity;
                    let textAlign = child.getAttribute("text-align") ?? "center";
                    let margin = parseFloat(child.getAttribute("margin")) ?? 0;
                    let blending = child.getAttribute("blending");
                    let wrapping = child.getAttribute("wrapping");

                    if (add) {
                        let canvas = Utils.generateTypographyCanvas({ text, fontSize, fontFamily, fontStyle, fontWeight, textWrap, textAlign, margin });
                        this.addTexture(name, canvas, { blending, wrapping, update: false });
                    } else {
                        this.shaderSketch.deleteTexture(name);
                    }
                }

                break;
        }
        
        this.shaderSketch.shouldCompileProgram = true;
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

    addTexture(name, image, { blending, wrapping, update }) {
        this.shaderSketch.addTexture(name, image, { blending, wrapping, update });
        this.shaderSketch.shouldCompileProgram = true;

        let index = this.loadingTextures.indexOf(name);

        if (index > -1) {
            this.loadingTextures.splice(this.loadingTextures.indexOf(name), 1);
        }
    }
}

export default ShaderSketchElement;