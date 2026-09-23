import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Descarga Clic Fitness | Clic Fitness',
  description: 'Descarga la app de Clic Fitness en tu dispositivo. Disponible en iOS y Android.',
  alternates: {
    canonical: 'https://www.clicfitness.com/linktree'
  }
}

export default function LinkTree (): React.ReactElement {
  const androidLink = 'https://play.google.com/store/apps/details?id=com.clicestudio.app&hl=es_AR'
  const iosLink = 'https://apps.apple.com/us/app/clic-fitness/id6806391392'

  return (
    <div className='min-h-screen w-full bg-background flex flex-col items-center justify-center px-4 py-12'>
      {/* Logo Section */}
      <div className='mb-12 text-center'>
        <h1 className='text-4xl md:text-5xl font-bold text-foreground mb-2'>Clic Fitness</h1>
        <p className='text-lg text-muted-foreground'>Descargá nuestra app y empezá a entrenar</p>
      </div>

      {/* App Download Buttons */}
      <div className='w-full max-w-sm space-y-4'>
        {/* iOS Button */}
        <Link
          href={iosLink}
          target='_blank'
          rel='noopener noreferrer'
          className='group block w-full'
        >
          <div className='w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent rounded-lg p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'>
            <div className='flex items-center justify-center gap-3'>
              <svg
                className='w-8 h-8'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M17.05 13.5c-.91 0-1.64.7-1.64 1.56 0 .9.73 1.59 1.64 1.59.91 0 1.64-.7 1.64-1.59 0-.86-.73-1.56-1.64-1.56zm-4.9 0c-.91 0-1.64.7-1.64 1.56 0 .9.73 1.59 1.64 1.59.91 0 1.64-.7 1.64-1.59 0-.86-.73-1.56-1.64-1.56z' />
                <path d='M22.1 6.5c-.1-.6-.45-1.1-.91-1.42.36-.59.58-1.25.58-1.98C21.77 1.57 20.2 0 18.16 0c-1.2 0-2.24.68-2.77 1.68h-2.78C11.8.68 10.76 0 9.57 0 7.52 0 5.95 1.57 5.95 3.1c0 .73.22 1.39.58 1.98-.46.32-.81.82-.91 1.42-.45 2.36 1.09 4.42 3.42 4.42h.5v6.83c0 1.53 1.22 2.78 2.75 2.78h5.5c1.53 0 2.75-1.25 2.75-2.78v-6.83h.5c2.33 0 3.87-2.06 3.42-4.42z' />
              </svg>
              <span className='text-background font-semibold text-lg'>Descargar en App Store</span>
            </div>
          </div>
        </Link>

        {/* Android Button */}
        <Link
          href={androidLink}
          target='_blank'
          rel='noopener noreferrer'
          className='group block w-full'
        >
          <div className='w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent rounded-lg p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'>
            <div className='flex items-center justify-center gap-3'>
              <svg
                className='w-8 h-8'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M3.9 8.67c0-.52.42-.94.94-.94.51 0 .94.42.94.94v6.66c0 .52-.42.94-.94.94-.51 0-.94-.42-.94-.94V8.67zm16.14 0c0-.52.42-.94.94-.94.51 0 .94.42.94.94v6.66c0 .52-.42.94-.94.94-.51 0-.94-.42-.94-.94V8.67zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z' />
              </svg>
              <span className='text-background font-semibold text-lg'>Descargar en Google Play</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer Text */}
      <div className='mt-12 text-center max-w-sm'>
        <p className='text-sm text-muted-foreground'>
          Disponible en iOS 13+ y Android 8+. Entrena donde quieras, cuando quieras.
        </p>
      </div>
    </div>
  )
}
