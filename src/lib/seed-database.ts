// import { supabase } from './supabase';
// import { seedData } from './seed-data';

// export async function seedDatabase() {
//   try {
//     // First, disable RLS temporarily to allow deletions
//     await supabase.rpc('disable_rls');

//     // Delete all existing rows from both tables with WHERE clause
//     const { error: deleteError } = await supabase
//       .from('comments')
//       .delete()
//       .neq('id', '00000000-0000-0000-0000-000000000000'); // This will match all rows
//     if (deleteError) throw deleteError;

//     const { error: resourcesDeleteError } = await supabase
//       .from('resources')
//       .delete()
//       .neq('id', '00000000-0000-0000-0000-000000000000'); // This will match all rows
//     if (resourcesDeleteError) throw resourcesDeleteError;

//     console.log('Successfully cleared existing data');

//     // Insert new seed data
//     const { error: seedError } = await supabase
//       .from('resources')
//       .insert(seedData);

//     if (seedError) throw seedError;

//     // Re-enable RLS
//     await supabase.rpc('enable_rls');

//     console.log('Database seeded successfully');
//   } catch (error) {
//     console.error('Error seeding database:', error);
//     // Ensure RLS is re-enabled even if there's an error
//     await supabase.rpc('enable_rls').catch(console.error);
//   }
// }