import { createClient } from '@supabase/supabase-js'

const getUsername = async (userId) => {
  let result = ''
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const { data: results } = await supabase
    .from('users')
    .select()
    .eq('user_id', userId)

  try {
    result = results[0].username
  } catch {

  }

  return result
}

export default getUsername
