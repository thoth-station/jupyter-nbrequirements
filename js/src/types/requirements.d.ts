export type ResolutionEngine = "thoth" | "pipenv"

export interface Requirements {
    aliases: { [ name: string ]: string }
    packages: { [ name: string ]: string | { version: string, index: string } }
    requires: Requires
    sources: ( SourcesEntity )[] | null
    "dev-packages"?: any
}

export interface RequirementsLocked {
    _meta: Meta
    default: { [ name: string ]: LockedPackageVersion }
    develop: { [ name: string ]: LockedPackageVersion }
}

export interface Meta {
    hash: Hash
    requires: Requires
    sources: ( SourcesEntity )[] | null
    "pipfile-spec"?: number
}

export interface Hash {
    sha256: string
}

export interface Requires {
    python_version: string
}

export interface SourcesEntity {
    name: string
    url: string
    verify_ssl: boolean
}

export interface LockedPackageVersion {
    version: string
    hashes: ( string )[] | null
    index?: string | null
    markers?: string | null
}
