import { createClient } from '@supabase/supabase-js';

const getUsername = async (user_id) => {
    let result = ""
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    const { data:results, error:commentsError } = await supabase
        .from('users')
        .select()
        .eq('user_id', user_id)

    try { 
        result = results[0].username
    }
    catch{ 

    }

    return result
}

export default getUsername