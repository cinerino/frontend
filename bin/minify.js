const fs = require('fs');

function minify(env) {
    const json = fs.readFileSync(`${__dirname}/../private/projects/${env}.json`, 'utf-8').replace(/\s+/g, '').replace(/\r?\n/g, '');
    fs.writeFileSync(`${__dirname}/../private/projects/minify/${env}.json`, json);
}
minify('local');
minify('development');
minify('test');
minify('production');