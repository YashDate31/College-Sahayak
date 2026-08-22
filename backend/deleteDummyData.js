require('dotenv').config();
const supabase = require('./config/supabase');

async function clearMaterials() {
  console.log('Deleting all materials from database to clear dummy data...');
  
  const { data, error } = await supabase
    .from('materials')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Hack to delete all rows since delete() requires a filter in Supabase

  if (error) {
    console.error('Error deleting materials:', error);
  } else {
    console.log('Successfully cleared all materials.');
  }
}

clearMaterials();
