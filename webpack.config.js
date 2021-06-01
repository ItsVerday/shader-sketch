const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'shader-sketch.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        include: path.resolve(__dirname, 'src/imports'),
        use: {
          loader: 'raw-loader'
        }
      }
    ]
  }
};