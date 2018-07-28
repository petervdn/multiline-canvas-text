module.exports = {
  devServer: {
    contentBase: './',
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
  output: {
    path: __dirname,
  },
};
