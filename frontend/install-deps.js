#!/usr/bin/env node

// Simple script to install dependencies using available package manager
const { spawn } = require('child_process');
const fs = require('fs');

async function installDeps() {
    // Check if pnpm is available
    try {
        await new Promise((resolve, reject) => {
            const child = spawn('pnpm', ['--version'], { stdio: 'ignore' });
            child.on('close', (code) => {
                if (code === 0) resolve();
                else reject();
            });
        });
        console.log('Using pnpm...');
        spawn('pnpm', ['install'], { stdio: 'inherit' });
    } catch (error) {
        // Try to install pnpm via npm
        console.log('pnpm not found, trying to install it...');
        try {
            await new Promise((resolve, reject) => {
                const child = spawn('npm', ['install', '-g', 'pnpm'], { stdio: 'inherit' });
                child.on('close', (code) => {
                    if (code === 0) resolve();
                    else reject();
                });
            });
            
            // Now try pnpm install
            spawn('pnpm', ['install'], { stdio: 'inherit' });
        } catch (npmError) {
            // Fall back to npm
            console.log('Failed to install pnpm, using npm...');
            // Remove pnpm-lock.yaml and use npm
            if (fs.existsSync('pnpm-lock.yaml')) {
                fs.unlinkSync('pnpm-lock.yaml');
            }
            spawn('npm', ['install'], { stdio: 'inherit' });
        }
    }
}

installDeps().catch(console.error);