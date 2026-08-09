import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('rentals').del();
  await knex('vehicles').del();
  await knex('staff').del();

  // Create Staff
  const passwordHash = await bcrypt.hash('password123', 10);
  const staff = [
    {
      id: 1,
      email: 'admin@rental.com',
      password_hash: passwordHash,
      name: 'Admin Staff',
    },
    {
      id: 2,
      email: 'john@rental.com',
      password_hash: passwordHash,
      name: 'John Doe',
    },
  ];
  await knex('staff').insert(staff);

  // Create Vehicles
  const vehicles = [
    {
      id: 1,
      name: 'Toyota Corolla',
      plate_number: 'ABC-1234',
      category: 'Sedan',
      daily_rate: 50.00,
      photo_path: null,
      deleted_at: null,
    },
    {
      id: 2,
      name: 'Ford Mustang',
      plate_number: 'XYZ-9876',
      category: 'Sport',
      daily_rate: 120.00,
      photo_path: null,
      deleted_at: null,
    },
    {
      id: 3,
      name: 'Tesla Model 3',
      plate_number: 'EV-2026',
      category: 'Electric',
      daily_rate: 150.00,
      photo_path: null,
      deleted_at: null,
    },
  ];
  await knex('vehicles').insert(vehicles);

  // Create Rentals
  const rentals = [
    {
      id: 1,
      vehicle_id: 1,
      customer_name: 'Alice Johnson',
      customer_phone: '123-456-7890',
      start_date: '2026-07-28', // Spans July-August 2026
      end_date: '2026-08-04',   // 8 days total: July 28, 29, 30, 31 (4 days) + Aug 1, 2, 3, 4 (4 days)
      total_amount: 400.00,     // 8 days * 50.00
      status: 'completed',
    },
    {
      id: 2,
      vehicle_id: 2,
      customer_name: 'Bob Smith',
      customer_phone: '987-654-3210',
      start_date: '2026-08-05',
      end_date: '2026-08-10',   // 6 days total
      total_amount: 720.00,     // 6 days * 120.00
      status: 'ongoing',
    },
    {
      id: 3,
      vehicle_id: 3,
      customer_name: 'Charlie Brown',
      customer_phone: '555-555-5555',
      start_date: '2026-08-12',
      end_date: '2026-08-15',   // 4 days total
      total_amount: 600.00,     // 4 days * 150.00
      status: 'booked',
    },
    {
      id: 4,
      vehicle_id: 1,
      customer_name: 'David Miller',
      customer_phone: '444-444-4444',
      start_date: '2026-08-20',
      end_date: '2026-08-25',   // 6 days total
      total_amount: 300.00,     // 6 days * 50.00
      status: 'cancelled',
    },
  ];
  await knex('rentals').insert(rentals);

  // Reset sequence values so manual inserts work correctly later
  await knex.raw("SELECT setval('staff_id_seq', (SELECT MAX(id) FROM staff))");
  await knex.raw("SELECT setval('vehicles_id_seq', (SELECT MAX(id) FROM vehicles))");
  await knex.raw("SELECT setval('rentals_id_seq', (SELECT MAX(id) FROM rentals))");
}
