/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffle<T>(candidate: T[]) {
  for (let i = candidate.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidate[i], candidate[j]] = [candidate[j], candidate[i]]
  }
}
