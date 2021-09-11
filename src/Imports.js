const IMPORT_REGISTRY = {};

function flattenArray(array) {
    let flattened = [];

    for (let value of array) {
        if (value instanceof Array) {
            flattened.push(...flattenArray(value));
        } else {
            flattened.push(value);
        }
    }

    return flattened;
}

class Import {
    constructor(name, code) {
        this.name = name;
        this.code = code;
    }

    getCode() {
        return `// IMPORT: ${this.name}
${this.code}
`;
    }

    static registerImport(name, code) {
        IMPORT_REGISTRY[name] = new Import(name, code);
    }

    static getImport(name) {
        return IMPORT_REGISTRY[name];
    }

    static resolveImports(importInstance) {
        if (importInstance.code instanceof Array) {
            let newImports = [];

            for (let importName of importInstance.code) {
                newImports.push(...Import.resolveImports(Import.getImport(importName)));
            }

            return newImports;
        }

        return [importInstance];
    }

    static resolveCode(imports) {
        imports = flattenArray(imports.map(importInstance => Import.resolveImports(importInstance)));
        let finalImports = [];

        for (let importInstance of imports) {
            if (finalImports.indexOf(importInstance) == -1) {
                finalImports.push(importInstance);
            }
        }

        return finalImports.map(importInstance => importInstance.getCode()).join("\n");
    }
}

let context = require.context("./imports/", true, /.*/);

for (let filename of context.keys()) {
    let code = require(`./imports/${filename.substring(2)}`).default;

    if (!filename.endsWith(".fsh")) {
        code = JSON.parse(code);
    }

    filename = filename.replace("./", "").replace(".fsh", "");

    IMPORT_REGISTRY[filename] = new Import(filename, code);
}

export default Import;