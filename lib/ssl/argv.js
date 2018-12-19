export async function argv({ events }) {
  await events.argv({
    alias: {
      b: ["buildKey"],
      d: ["dry"],
    },
  })
}
