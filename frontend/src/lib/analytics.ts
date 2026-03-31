import { posthog } from './posthog'

export const analytics = {
  signupCompleted: (email: string) => posthog.capture('signup_completed', { email }),
  scanStarted: (url: string, domain: string) => posthog.capture('scan_started', { url, domain }),
  scanCompleted: (domain: string, score: number) => posthog.capture('scan_completed', { domain, score }),
  paywallShown: (domain: string, score: number) => posthog.capture('paywall_shown', { domain, score }),
  paymentStarted: (domain: string, scanId: string) => posthog.capture('payment_started', { domain, scanId }),
  paymentCompleted: (scanId: string, amount: number) => posthog.capture('payment_completed', { scanId, amount }),
  pdfDownloaded: (scanId: string) => posthog.capture('pdf_downloaded', { scanId }),
  shareClicked: (platform: string, domain: string) => posthog.capture('share_clicked', { platform, domain }),
  identifyUser: (userId: string, email: string) => posthog.identify(userId, { email }),
}
