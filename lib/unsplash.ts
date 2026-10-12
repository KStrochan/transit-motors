/** Hotlinked Unsplash photo, cropped and sized at the source. */
export function unsplash(id: string, width = 1600): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}
