please do not createconst file = 'src/app/lib/emailService.js';
let data = fs.readFileSync(file, 'utf8');

// The sequence in the user's screenshot is 'ðŸŽ‰' (Party Popper emoji converted to Latin1 incorrectly)
// I will just wipe out ALL sequences of ðŸ... and âœ... and Â© to fully purge the template of mojibake and convert them to ASCII.

data = data.replace(/ðŸŽ‰/g, '[ Success! ]'); 
data = data.replace(/âœ“/g, '✓'); 
data = data.replace(/ðŸ‘‹/g, ''); 
data = data.replace(/Â©/g, '©'); 
data = data.replace(/ðŸ› ï¸/g, '[ NEW ORDER ]'); 
data = data.replace(/ðŸ›’/g, ''); 
data = data.replace(/ðŸŽ¨/g, ''); 
data = data.replace(/âœ…/g, '✓'); 
data = data.replace(/ðŸ‘¤/g, ''); 
data = data.replace(/ðŸ“¸/g, ''); 
data = data.replace(/ðŸ“Š/g, ''); 
data = data.replace(/ðŸ¤ /g, ''); 
data = data.replace(/âœ¨/g, ''); 
data = data.replace(/ðŸ–¼ï¸/g, ''); 
data = data.replace(/â ¤ï¸/g, ''); 
data = data.replace(/ðŸ‘¨â€ ðŸŽ¨/g, ''); 
data = data.replace(/ðŸŽ­/g, ''); 
data = data.replace(/ðŸš€/g, ''); 
data = data.replace(/ðŸ“…/g, ''); 
data = data.replace(/ðŸ’¡/g, ''); 

// Aggressive match for any leftover broken Mojibake starting with ðŸ or âœ
data = data.replace(/ðŸ[A-Za-z0-9\sªº¿œŽ]+/g, '');
data = data.replace(/âœ[A-Za-z0-9\sªº¿œŽ]+/g, '✓');
data = data.replace(/Â/g, '');

fs.writeFileSync(file, data, 'utf8');
console.log('Sanitization complete!');
