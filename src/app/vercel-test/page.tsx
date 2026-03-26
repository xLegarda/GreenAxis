'use client'

export default function TestPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#1a1a2e',
      color: 'white',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        VERCEL FUNCIONANDO
      </h1>
      <p style={{ fontSize: '1.5rem', color: '#22c55e' }}>
        Si ves esta pagina, Vercel esta desplegando correctamente
      </p>
      <p style={{ marginTop: '2rem', color: '#9ca3af' }}>
        Prueba: {new Date().toISOString()}
      </p>
    </div>
  )
}
