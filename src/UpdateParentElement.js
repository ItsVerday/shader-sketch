import ShaderSketchElement from "./ShaderSketchElement";

class UpdateParentElement extends HTMLElement {
    connectedCallback() {
        if (this.parentNode instanceof ShaderSketchElement) {
            this.parent = this.parentNode;
            
            this.parent.updateChild({
                child: this,
                add: true
            });
        }
    }
    
    disconnectedCallback() {
        if (this.parent instanceof ShaderSketchElement) {
            this.parent.updateChild({
                child: this,
                add: false
            });

            this.parent = null;
        }
    }
}

export default UpdateParentElement;