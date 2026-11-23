#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path');
const root=path.resolve(process.argv[2]||process.cwd());
const payload=JSON.parse(fs.readFileSync(path.join(__dirname,'profile-update-payload.json'),'utf8'));
function edit(text,operations,file){
 for(const [from,to] of operations){if(!text.includes(from))throw new Error('Expected integration point not found in '+file+': '+from.slice(0,75));text=text.replace(from,to);}return text;
}
try{
 let app=fs.readFileSync(path.join(root,'app.js'),'utf8'),server=fs.readFileSync(path.join(root,'server.js'),'utf8'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 if(app.includes('function renderProfile(')||server.includes('function validateProfileChanges('))throw new Error('Profile support already exists or was partially installed. No files changed.');
 app=edit(app,payload.appOps,'app.js')+'\n\n'+payload.client;
 server=edit(server,payload.serverOps,'server.js');
 let removed=0,inserted=false;
 html=html.replace(/<button\b(?=[^>]*class="[^"]*\bmenu-item\b)[^>]*>[\s\S]*?<\/button>/g,button=>{
  if(!/navigate\('(?:dna|wardrobe)'\)/.test(button))return button;
  removed++;if(!inserted){inserted=true;return payload.profileButton;}return '';
 });
 if(removed!==2||!html.includes('</head>'))throw new Error('Expected profile-menu entries or HTML head not found. No files changed.');
 html=html.replace('<span id="topRole">BSIT Candidate</span>','<span id="topRole">Alumni Students</span>');
 html=html.replace(/src=(["'])app\.js(?:\?[^"']*)?\1/g,'src="app.js?v=alumni-profile-1"');
 html=html.replace('</head>','  <link rel="stylesheet" href="profile.css?v=alumni-profile-1">\n</head>');
 // All matches are validated before any project file is touched.
 const backup=path.join(root,'profile-update-backup-'+Date.now());fs.mkdirSync(backup);
 for(const file of ['app.js','server.js','index.html'])fs.copyFileSync(path.join(root,file),path.join(backup,file));
 if(fs.existsSync(path.join(root,'profile.css')))fs.copyFileSync(path.join(root,'profile.css'),path.join(backup,'profile.css'));
 for(const [file,data] of [['app.js',app],['server.js',server],['index.html',html],['profile.css',payload.css]])fs.writeFileSync(path.join(root,file),data);
 console.log('Installed only alumni/profile changes. Existing dashboard designs and other files were preserved.');
 console.log('Backups created in '+path.basename(backup)+'. Restart your server and hard-refresh.');
}catch(error){console.error(error.message);process.exitCode=1;}
