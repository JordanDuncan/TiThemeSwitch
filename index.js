#! /usr/bin/env node

var cwd = process.cwd();

var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { 
  //sys.puts(stdout);
}

// Check if in a titanium project
if(!fs.existsSync(cwd + '/tiapp.xml')){
  console.error('Run from the root of an Alloy project');
  process.exit(1);
}

// Check if theme supplied
if(process.argv.length < 3){
  console.error('No theme name supplied');
  process.exit(1);
}

// Check if theme is valid
if(!fs.existsSync(cwd + '/app/themes/'+process.argv[2]+'/')){
  console.error('"' + process.argv[2] + '" not a valid theme');
  process.exit(1);
}

console.log('Switching to theme: "' + process.argv[2] + '"');

// Open config.json, change theme, write new config.json
var cfg = require(cwd + '/app/config.json');
cfg.global.theme = process.argv[2];
fs.writeFileSync(cwd + '/app/config.json', JSON.stringify(cfg, null, 2));

exec("tich select", puts);

console.log('TiCh cleaning...');
exec("tich clean", puts);

console.log('Ti cleaning...');
exec("ti clean", puts);
