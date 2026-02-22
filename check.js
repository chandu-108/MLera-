const { execSync } = require('child_process');
try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
} catch (e) {
    const errText = e.stdout.toString();
    const fs = require('fs');
    fs.writeFileSync('ts_errors.log', errText);
}
