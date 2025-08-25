import { AppDataSource } from '@/config/database.config';
import { UserSeeder } from './user.seeder';

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    const userSeeder = new UserSeeder(AppDataSource);
    await userSeeder.run();

    console.log('All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
}

runSeeds();
