const Utils = {};

Utils.initShaderProgram = function(gl, vsSource, fsSource) {
    const vertexShader = Utils.loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = Utils.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        
    if (vertexShader == null || fragmentShader == null) {
        return null;
    }

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.groupCollapsed("Shader Sketch Program Link Error");
        console.error(gl.getProgramInfoLog(shaderProgram));
        console.groupEnd();
            
        return null;
    }

    return shaderProgram;
}

Utils.loadShader = function(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.groupCollapsed("Shader Sketch Shader Compilation Error");
        console.error(gl.getShaderInfoLog(shader));
        console.groupCollapsed("Shader Source...");
        console.log(source);
        console.groupEnd();
        console.groupEnd();
        gl.deleteShader(shader);

        return null;
    }

    return shader;
}

Utils.parseUniformValues = function(...values) {
    if (typeof values[0] == "string") {
        values[0] = values[0].replace(" ", "").replace("[", "").replace("]", "");
        
        values = values[0].split(",").map(parseFloat);
    }
    
    if (values[0] instanceof Array) {
        values = values[0];
    }
    
    return values;
}

export default Utils;