// Packages
import dotEvent from "dot-event"
import dotTask from "@dot-event/task"

// Helpers
import ssl from "../"

async function run(...argv) {
  await events.task({
    argv,
    op: "ssl",
    path: `${__dirname}/fixture`,
  })
}

// Variables
let events

// Tests
beforeEach(async () => {
  events = dotEvent()

  ssl({ events })
  dotTask({ events })
})

test("sslBuildKey", async () => {
  const csrPath = `${__dirname}/fixture/wildcard.inverse.com.csr`
  const keyPath = `${__dirname}/fixture/wildcard.inverse.com.key`

  await events.fsRemove({ path: csrPath })
  await events.fsRemove({ path: keyPath })

  await run("-b", "--domain=*.inverse.com")

  const csrExists = await events.fsPathExists({
    path: csrPath,
  })
  const keyExists = await events.fsPathExists({
    path: keyPath,
  })

  expect(csrExists).toBe(true)
  expect(keyExists).toBe(true)
})
