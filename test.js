const annotations = require('tzero-annotations');
const registry = new annotations.Registry();

registry.registerAnnotation(__dirname + '/test.annotation.js');

const reader = new annotations.Reader(registry);

reader.parse(__dirname + '/annotations.js', annotations.Reader.ES6);

console.log(reader.definitionAnnotations[0].value, reader.definitionAnnotations[0].test);
console.log(reader.definitionAnnotations[0].name());