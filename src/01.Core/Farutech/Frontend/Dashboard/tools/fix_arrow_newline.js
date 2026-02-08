const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const root = path.resolve(__dirname, '..');
const files = walk(root);
let changed = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const orig = content;
  // Replace newline followed by whitespace then => with single space and =>
  content = content.replace(/\r?\n\s*=>/g, ' =>');
  if (content !== orig) {
    fs.copyFileSync(f, f + '.bak');
    fs.writeFileSync(f, content, 'utf8');
    changed++;
    console.log('Patched', f);
  }
});
console.log('Done. Files changed:', changed);
