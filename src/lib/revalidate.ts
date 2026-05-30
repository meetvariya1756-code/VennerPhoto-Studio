/**
 * Triggers on-demand static cache revalidation for all public pages
 */
export async function triggerRevalidation() {
  try {
    const secret = process.env.NEXT_PUBLIC_REVALIDATE_SECRET || 'venner_studio_secret_9988';
    fetch(`/api/revalidate?secret=${secret}`).catch(err => {
      console.warn('Revalidation hook warning:', err);
    });
  } catch (err) {
    console.warn('Failed to call revalidation webhook:', err);
  }
}
