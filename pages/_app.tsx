import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, type Session } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import '@fontsource/public-sans'
import { CssVarsProvider } from '@mui/joy/styles'

export default function App ({ Component, pageProps }: AppProps<{
  initialSession: Session
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <CssVarsProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </CssVarsProvider>
    </SessionContextProvider>
  )
}
