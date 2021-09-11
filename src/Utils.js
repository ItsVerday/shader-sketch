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
        let errors = gl.getShaderInfoLog(shader);
        Utils.shaderError(source, errors);

        console.groupCollapsed("(Advanced info)");
        console.error(errors);
        console.groupCollapsed("Shader Source...");
        console.log(source);
        console.groupEnd();
        console.groupEnd();
        console.groupEnd();

        gl.deleteShader(shader);

        return null;
    }

    return shader;
}

Utils.BEGIN_USER_CODE = "// BEGIN USER CODE //";

Utils.shaderError = function( source, errors) {
    let code = source.split("\n");
    errors = errors.split("\n");
    errors.splice(errors.length - 1, 1);

    let userCodeStart = 0;
    for (let i = 0; i < code.length; i++) {
        if (code[i] === Utils.BEGIN_USER_CODE) {
            userCodeStart = i;
            break;
        }
    }

    let errorData = [];
    let globalErrors = [];

    for (let error of errors) {
        const regex = /ERROR: \d+:(\d+): (.*)/i;
        const match = regex.exec(error);

        if (match === null) {
            const newRegex = /ERROR: (.*)/i;
            const newMatch = newRegex.exec(error);

            globalErrors.push({
                message: newMatch[1]
            });

            continue;
        }

        errorData.push({
            line: parseInt(match[1]) - 1,
            message: match[2]
        });
    }

    let shaderSketchErrors = [];
    let userErrors = [];

    for (let error of errorData) {
        if (error.line <= userCodeStart) {
            shaderSketchErrors.push(error);
        } else {
            userErrors.push(error);
        }
    }

    console.group("Shader Sketch Shader Compilation Error");
    if (shaderSketchErrors.length > 0) {
        console.error(`${shaderSketchErrors.map(({line, message}) => `INTERNAL ERROR @ LINE ${line}: ${message}`).join("\n")}`);
        console.warn("These errors are internal errors from shader-sketch itself, and are not your fault! Please report this at https://github.com/ValgoBoi/shader-sketch/issues/new with as much detail as possible, including your code and this error message!");
    }

    if (userErrors.length > 0 || globalErrors.length > 0) {
        let includeLines = [];

        for (let i = 0; i < code.length; i++) {
            includeLines.push(false);
        }

        const RADIUS = 2;
        for (let userError of userErrors) {
            for (let offset = -RADIUS; offset <= RADIUS; offset++) {
                let trueLine = offset + userError.line;
                if (trueLine < 0 || trueLine >= code.length) continue;
                includeLines[trueLine] = true;
            }
        }
        
        let messageComponents = [];
        for (let globalError of globalErrors) {
            messageComponents.push({
                message: `GLOBAL ERROR: ${globalError.message}\n`,
                color: "#FF0000"
            });
        }

        let previousInclude = true;
        for (let i = 0; i < includeLines.length; i++) {
            let include = includeLines[i];

            if (include) {
                messageComponents.push({
                    message: `${(i - userCodeStart).toString().padEnd(2, " ")} | `,
                    color: "#0033FF"
                });

                messageComponents.push({
                    message: `${code[i]}\n`,
                    color: "#111111"
                });

                for (let userError of userErrors) {
                    if (userError.line !== i) continue;

                    messageComponents.push({
                        message: `   | `,
                        color: "#0033FF"
                    });

                    messageComponents.push({
                        message: `ERROR: ${userError.message}\n`,
                        color: "#FF0000"
                    });
                }
            } else {
                if (previousInclude === true) {
                    messageComponents.push({
                        message: "...\n",
                        color: "#888888"
                    });
                }
            }

            previousInclude = include;
        }

        console.log(messageComponents.map(({message}) => `%c${message}`).join(""), ...messageComponents.map(({color}) => `color: ${color};`));
    }
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