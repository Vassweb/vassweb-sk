import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Vass & Co. — Premium Web Solutions'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0908',
          position: 'relative',
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse at center, rgba(191,155,48,0.08) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top decorative line */}
        <div
          style={{
            width: 120,
            height: 2,
            backgroundColor: '#BF9B30',
            marginBottom: 40,
            display: 'flex',
          }}
        />

        {/* VW Monogram */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: '#BF9B30',
            letterSpacing: '0.15em',
            lineHeight: 1,
            marginBottom: 16,
            display: 'flex',
          }}
        >
          VW
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#BF9B30',
            letterSpacing: '0.08em',
            marginBottom: 16,
            display: 'flex',
          }}
        >
          Vass & Co.
        </div>

        {/* Decorative separator */}
        <div
          style={{
            width: 80,
            height: 1,
            backgroundColor: 'rgba(191,155,48,0.5)',
            marginBottom: 20,
            display: 'flex',
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: 'rgba(191,155,48,0.75)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          Premium Web Solutions
        </div>

        {/* Bottom decorative line */}
        <div
          style={{
            width: 120,
            height: 2,
            backgroundColor: '#BF9B30',
            marginTop: 40,
            display: 'flex',
          }}
        />

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 16,
            color: 'rgba(191,155,48,0.4)',
            letterSpacing: '0.2em',
            display: 'flex',
          }}
        >
          vassweb.sk
        </div>
      </div>
    ),
    { ...size }
  )
}
