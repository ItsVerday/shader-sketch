import ImportData from "./ImportData";

const IMPORT_REGISTRY = {};

class Import {
    constructor(name, code) {
        this.name = name;
        this.code = code;
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
        imports = imports.map(importInstance => Import.resolveImports(importInstance));
        imports = imports.flat(Infinity);
        let finalImports = [];

        for (let importInstance of imports) {
            if (finalImports.indexOf(importInstance) == -1) {
                finalImports.push(importInstance);
            }
        }

        return finalImports.map(importInstance => importInstance.code).join("\n");
    }
}

for (let name in ImportData) {
    Import.registerImport(name, ImportData[name]);
}

export default Import;