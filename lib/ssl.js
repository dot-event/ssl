// Packages
import dotArgv, { argvRelay } from "@dot-event/argv"
import dotFs from "@dot-event/fs"
import dotLog from "@dot-event/log"
import dotSpawn from "@dot-event/spawn"

// Helpers
import { argv } from "./ssl/argv"
import { buildKey } from "./ssl/buildKey"

// Composer
export default function(options) {
  const { events } = options

  if (events.ops.has("ssl")) {
    return options
  }

  dotArgv({ events })
  dotFs({ events })
  dotLog({ events })
  dotSpawn({ events })

  events.onAny({
    ssl: argvRelay,
    sslBuildKey: buildKey,
    sslSetupOnce: argv,
  })

  return options
}
