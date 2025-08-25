import { DataSource } from 'typeorm';
import { User, Gender, UserStatus } from '@/database/entities/user.entity';

export class UserSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);

    const users = [
      {
        login: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'Michael',
        gender: Gender.MALE,
        age: 30,
        phone: '+1234567890',
        email: 'john.doe@example.com',
        avatar: 'https://example.com/avatars/john.jpg',
        status: UserStatus.ACTIVE,
      },
      {
        login: 'jane_smith',
        firstName: 'Jane',
        lastName: 'Smith',
        gender: Gender.FEMALE,
        age: 25,
        phone: '+0987654321',
        email: 'jane.smith@example.com',
        avatar: 'https://example.com/avatars/jane.jpg',
        status: UserStatus.ACTIVE,
      },
      {
        login: 'alex_johnson',
        firstName: 'Alex',
        lastName: 'Johnson',
        middleName: 'Robert',
        gender: Gender.MALE,
        age: 28,
        phone: '+1122334455',
        email: 'alex.johnson@example.com',
        status: UserStatus.ACTIVE,
      },
      {
        login: 'maria_garcia',
        firstName: 'Maria',
        lastName: 'Garcia',
        gender: Gender.FEMALE,
        age: 35,
        phone: '+1555666777',
        email: 'maria.garcia@example.com',
        avatar: 'https://example.com/avatars/maria.jpg',
        status: UserStatus.INACTIVE,
      },
      {
        login: 'david_wilson',
        firstName: 'David',
        lastName: 'Wilson',
        gender: Gender.MALE,
        age: 42,
        phone: '+1888999000',
        email: 'david.wilson@example.com',
        status: UserStatus.SUSPENDED,
      },
    ];

    for (const userData of users) {
      const existingUser = await userRepository.findOne({
        where: [{ email: userData.email }, { login: userData.login }],
      });

      if (!existingUser) {
        const user = userRepository.create(userData);
        await userRepository.save(user);
        console.log(`Created user: ${userData.firstName} ${userData.lastName}`);
      }
    }

    console.log('User seeding completed!');
  }
}
