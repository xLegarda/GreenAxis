import { db } from '@/lib/db'
import { GoogleAnalytics } from './google-analytics'

export async function AnalyticsLoader() {
  try {
    const config = await db.platformConfig.findFirst()
    return <GoogleAnalytics measurementId={config?.googleAnalytics || null} />
  } catch {
    return null
  }
}
