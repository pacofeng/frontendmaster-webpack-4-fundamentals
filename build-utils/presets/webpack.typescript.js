module.exports = () => {
  return {
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: ['ts-loader']
        }
      ]
    }
  }
}