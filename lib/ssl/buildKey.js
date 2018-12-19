import { resolve } from "path"

export async function buildKey(options) {
  const { cwd, dest, domain, events, path, props } = options

  const basePath = resolve(cwd, dest || path)

  const domainPath = resolve(
    basePath,
    domain.replace(/\*/, "wildcard")
  )
  const config = await sslConfig({ ...options, domainPath })

  await events.fsEnsureDir(props, { path: basePath })

  const tmpConfigPath = await events.fsWriteTmp(props, {
    body: config,
  })

  await events.spawn({
    args: [
      "req",
      "-new",
      "-config",
      tmpConfigPath,
      "-out",
      `${domainPath}.csr`,
    ],
    command: "openssl",
    env: { ...process.env, RANDFILE: `${basePath}/.rnd` },
  })
}

function sslConfig(options) {
  const {
    city = "New York",
    country = "US",
    domain,
    email,
    domainPath,
    org,
    state = "New York",
  } = options

  return `
    [ req ]
    default_bits        = 2048
    default_md          = sha256
    default_keyfile     = ${domainPath}.key
    prompt              = no
    encrypt_key         = no
    distinguished_name  = req_distinguished_name
    [ req_distinguished_name ]
    countryName         = "${country}"
    stateOrProvinceName = "${state}"
    localityName        = "${city}"
    organizationName    = "${org}"
    commonName          = "${domain}"
    emailAddress        = "${email}"
  `.replace(/^\s+/gm, "")
}
