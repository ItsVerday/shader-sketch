import ShaderSketchElement from "./ShaderSketchElement";

class UpdateParentElement extends HTMLElement {
    connectedCallback() {
        if (this.parentNode instanceof ShaderSketchElement) {
            this.parent = this.parentNode;
            
            this.parent.updateChildren();
        }
    }
    
    disconnectedCallback() {
        if (this.parent instanceof ShaderSketchElement) {
            this.parent.updateChildren();

            this.parent = null;
        }
    }
}

export default UpdateParentElement;