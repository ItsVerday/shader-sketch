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
        console.log(source.split("\n"));
        console.groupEnd();
        console.groupEnd();
        gl.deleteShader(shader);

        return null;
    }

    return shader;
}

Utils.removeAll = function(string, remove) {
    let finalString = string;
    remove.forEach(value => finalString = finalString.split(value).join(""));

    return finalString;
}

Utils.parseUniformValues = function(...values) {
    if (typeof values[0] == "string") {
        values[0] = Utils.removeAll(values[0], [ " ", "[", "]" ]);

        values = values[0].split(",").map(parseFloat);
    }
    
    if (values[0] instanceof Array) {
        values = values[0];
    }
    
    return values;
}

Utils.textWrap = function(context, text, textWrap) {
    if (textWrap == Infinity) {
        return {
            lines: [text],
            width: context.measureText(text).width
        };
    }

    let lines = [""];
    let maximumWidth = 0;
    
    for (let word of text.split(" ")) {
        let testString = `${lines[lines.length - 1]} ${word}`.trim();

        let { width } = context.measureText(testString);

        if (width > textWrap && lines[lines.length - 1] != "") {
            lines.push(word);

            width = context.measureText(word).width;

            if (width > maximumWidth) {
                maximumWidth = width;
            }
        } else {
            if (width > maximumWidth) {
                maximumWidth = width;
            }

            lines[lines.length - 1] = testString;
        }
    }

    return {
        lines,
        width: maximumWidth
    };
}

Utils.determineFontHeight = function(fontStyle) {
    let body = document.getElementsByTagName("body")[0];
    let dummy = document.createElement("div");
    let dummyText = document.createTextNode("M");
    dummy.appendChild(dummyText);
    dummy.setAttribute("style", fontStyle);
    body.appendChild(dummy);
    let result = dummy.offsetHeight;
    body.removeChild(dummy);
    return result;
};

Utils.generateTypographyCanvas = function({ text, fontSize, fontFamily, fontStyle, fontWeight, textWrap, textAlign, margin }) {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");

    let font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

    context.textAlign = textAlign;

    context.font = font;
    let { lines, width } = Utils.textWrap(context, text, textWrap);
    let fontHeight = Utils.determineFontHeight(`font: ${font};`);
    let height = fontHeight * lines.length;

    canvas.width = width + margin * 2;
    canvas.height = height + margin * 2;

    context.font = font;
    context.textBaseline = "top";

    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "white";

    context.translate(0, canvas.height);
    context.scale(1, -1);

    let y = margin;
    for (let line of lines) {
        context.fillText(line, margin, y);
        y += fontHeight;
    }

    return canvas;
}

export default Utils;