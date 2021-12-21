const {override, fixBabelImports, addLessLoader} = require('customize-cra');

module.exports = override(
  // Implement on-demand packaging for antd
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,  
  }),

  // Use less-loader to reassign less variables in the source code
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': '#256eb8'},
  }),
)