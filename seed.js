const { exec } = require('child_process');

console.log('Running database seeder...');
exec('npx ts-node src/database/seeds/run-seeds.ts', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Stdout: ${stdout}`);
});
