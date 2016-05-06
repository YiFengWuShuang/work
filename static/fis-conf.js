
// 文件指纹
fis.match('*.{js,css,png,jpg,gif}', {
  useHash: true
});

// 压缩资源
fis.match('*.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

// fis3-hook-relative 插件开启相对地址
fis.hook('relative');
fis.match('**', { relative: true });