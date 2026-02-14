#!/usr/bin/env node
/**
 * Add a new project to the dashboard
 * Usage: node add-project.js --id=my-project --title="My Project" --description="..." --url=/my-project/
 */

const fs = require('fs');
const path = require('path');

function addProject(args) {
    const projectsPath = path.join(__dirname, 'projects.json');
    const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    
    // Generate next number
    const nextNumber = String(projects.length + 1).padStart(2, '0');
    
    // Create new project
    const newProject = {
        id: args.id,
        number: nextNumber,
        title: args.title,
        description: args.description,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        url: args.url,
        isNew: true
    };
    
    // Mark all existing projects as not new
    projects.forEach(p => p.isNew = false);
    
    // Add new project to beginning
    projects.unshift(newProject);
    
    // Renumber all projects
    projects.forEach((p, index) => {
        p.number = String(index + 1).padStart(2, '0');
    });
    
    // Save
    fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2));
    
    console.log(`✓ Added project: ${args.title}`);
    console.log(`  Number: ${nextNumber}`);
    console.log(`  URL: ${args.url}`);
    // Deploy to nginx
    const { execSync } = require('child_process');
    execSync('cp ' + projectsPath + ' /var/www/previews/projects.json');
    console.log('Deployed to http://68.183.51.209/');
}

function parseArgs() {
    const args = {};
    process.argv.slice(2).forEach(arg => {
        if (arg.startsWith('--')) {
            const [key, value] = arg.slice(2).split('=');
            args[key] = value || true;
        }
    });
    return args;
}

const args = parseArgs();

if (!args.id || !args.title || !args.description || !args.url) {
    console.error('Usage: node add-project.js --id=my-project --title="Title" --description="Description" --url=/my-project/');
    process.exit(1);
}

addProject(args);
