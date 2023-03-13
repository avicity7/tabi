import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import '@fontsource/public-sans';
import { CssVarsProvider } from '@mui/joy/styles';
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps<{
  initialSession: Session
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <>
      <Script 
      id="Adesense-id" 
      data-ad-client="ca-pub-5888321340977192" 
      async strategy="afterInteractive" 
      onError={ (e) => { console.error('Script failed to load', e) }}
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      />
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
    </>
  )
}
