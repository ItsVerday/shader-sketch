const fs = require("fs");
const path = require("path");
const minify = require("webpack-glsl-minify/build/minify");

const IN_FOLDER = "src/pretty_imports";
const OUT_FOLDER = "src/imports";

try {
    fs.mkdirSync(OUT_FOLDER);
} catch (e) {}

fs.readdir(IN_FOLDER, (err, files) => {
    files.forEach(async file => {
        if (path.extname(file) === ".fsh") {
            const minifier = new minify.GlslMinify({
                output: "object"
            });

            const contents = await new Promise(resolve => fs.readFile(path.join(IN_FOLDER, file), (err, contents) => resolve(contents))).then(buffer => buffer.toString());
            const output = await minifier.execute(contents).then(({sourceCode}) => sourceCode);

            fs.writeFile(path.join(OUT_FOLDER, file), output, err => {
                if (err) throw err;
            });
        } else {
            const contents = await new Promise(resolve => fs.readFile(path.join(IN_FOLDER, file), (err, contents) => resolve(contents))).then(buffer => buffer.toString());
            fs.writeFile(path.join(OUT_FOLDER, file), JSON.stringify(JSON.parse(contents)), err => {
                if (err) throw err;
            });
        }

        console.log(`${file} has been minified!`);
    });
});