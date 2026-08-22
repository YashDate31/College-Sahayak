require('dotenv').config();
const supabase = require('./config/supabase');

async function setAdminRole() {
  const adminEmail = 'yashdate31@gmail.com';
  
  console.log(`Setting role to 'admin' for ${adminEmail}...`);
  
  const { data, error } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('email', adminEmail)
    .select();

  if (error) {
    console.error('Error updating role:', error);
  } else if (data.length === 0) {
    console.log(`User with email ${adminEmail} not found. Please register this account first.`);
  } else {
    console.log(`Successfully updated role to 'admin' for ${adminEmail}!`);
  }
}

setAdminRole();
