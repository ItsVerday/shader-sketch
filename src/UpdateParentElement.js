import ShaderSketchElement from "./ShaderSketchElement";

class UpdateParentElement extends HTMLElement {
    connectedCallback() {
        this.update(this.parentNode);
    }

    update(parent) {
        if (parent instanceof ShaderSketchElement) {
            this.parent = parent;
            
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