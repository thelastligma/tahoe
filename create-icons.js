const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

// Icon sizes needed for macOS
const sizes = [16, 32, 64, 128, 256, 512, 1024];

// Create a simple black square with white box icon (rounded)
async function createIcon() {
    try {
        // Create base SVG with rounded corners
        const svgIcon = `
        <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <clipPath id="roundedClip">
                    <rect width="1024" height="1024" rx="180" ry="180"/>
                </clipPath>
            </defs>
            <rect width="1024" height="1024" fill="#000000" rx="180" ry="180"/>
            <g clip-path="url(#roundedClip)">
                <g transform="translate(512, 512)">
                    <g transform="translate(-192, -192) scale(16)">
                        <path d="m21 8-4-4H5l-4 4v13a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8z" 
                              fill="none" 
                              stroke="#ffffff" 
                              stroke-width="2" 
                              stroke-linecap="round" 
                              stroke-linejoin="round"/>
                        <path d="m1 8 10-4 10 4" 
                              fill="none" 
                              stroke="#ffffff" 
                              stroke-width="2" 
                              stroke-linecap="round" 
                              stroke-linejoin="round"/>
                    </g>
                </g>
            </g>
        </svg>`;

        // Generate PNG files for each size
        for (const size of sizes) {
            await sharp(Buffer.from(svgIcon))
                .resize(size, size)
                .png()
                .toFile(path.join(buildDir, `icon_${size}x${size}.png`));
            console.log(`Created icon_${size}x${size}.png`);
        }

        // Create icon.png (512x512 default)
        await sharp(Buffer.from(svgIcon))
            .resize(512, 512)
            .png()
            .toFile(path.join(buildDir, 'icon.png'));
        console.log('Created icon.png');

        console.log('All icons created successfully!');
    } catch (error) {
        console.error('Error creating icons:', error);
    }
}

createIcon();
