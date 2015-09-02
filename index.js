#! /usr/bin/env node

var cwd = process.cwd();

var fs = require('fs');
var sys = require('sys');
var path = require('path');
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { 
  //sys.puts(stdout);
}

// Check if in a titanium project
if(!fs.existsSync(cwd + '/tiapp.xml')){
  console.error('Run from the root of an Alloy project');
  process.exit(1);
}

// check if using themes
if(!fs.existsSync(cwd + '/app/themes/')){
  console.error('No Alloy themes folder.');
  process.exit(1);
}

// Get list of themes
var themeList = fs.readdirSync(cwd + '/app/themes/').filter(function(file) {
  return fs.statSync(path.join(cwd + '/app/themes/', file)).isDirectory();
});

// Check if any themes in use
if(themeList.length == 0){
  console.error('No Alloy themes in /app/themes/.');
  process.exit(1);
}

// Check if theme supplied
if(process.argv.length < 3){
  console.error('No theme name supplied');
  process.exit(1);
}

// check if -list tag
if(process.argv[2] == '-list'){
  console.log('\033[93mTHEMES FOUND IN /app/themes/\ntithemeswitch <index> to switch\033[0m');
  for(var i in themeList){
    console.log('  \033[92m[' + i + ']\033[0m ' + themeList[i]);
  }
  process.exit(1);
}

// set themename variable
var themeName = process.argv[2];

// Check if theme is valid
if(!fs.existsSync(cwd + '/app/themes/'+process.argv[2]+'/')){
  if(!isNaN(process.argv[2]) && parseInt(process.argv[2]) < themeList.length){
    themeName = themeList[parseInt(process.argv[2])];
  } else {
    console.error('"' + process.argv[2] + '" not a valid theme');
    process.exit(1);
  }
}

console.log('Switching to theme: "' + themeName + '"');

// Open config.json, change theme, write new config.json
var cfg = require(cwd + '/app/config.json');
cfg.global.theme = themeName;
fs.writeFileSync(cwd + '/app/config.json', JSON.stringify(cfg, null, 2));

exec("tich select", puts);

console.log('TiCh cleaning...');
exec("tich clean", puts);

console.log('Ti cleaning...');
exec("ti clean", puts);
