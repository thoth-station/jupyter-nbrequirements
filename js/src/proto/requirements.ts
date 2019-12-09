import { Requirements, RequirementsLocked } from "../types/requirements"
export { Requirements, RequirementsLocked }

let obj: any = null
export class RequirementsLockedProxy {
    public readonly _meta: MetaProxy;
    public readonly default: DefaultOrDevelopProxy;
    public readonly develop: DefaultOrDevelopProxy;
    public static Parse( d: string ): RequirementsLockedProxy {
        return RequirementsLockedProxy.Create( JSON.parse( d ) )
    }
    public static Create( d: any, field: string = "root" ): RequirementsLockedProxy {
        if ( !field ) {
            obj = d
            field = "root"
        }
        if ( d === null || d === undefined ) {
            throwNull2NonNull( field, d )
        } else if ( typeof ( d ) !== "object" ) {
            throwNotObject( field, d, false )
        } else if ( Array.isArray( d ) ) {
            throwIsArray( field, d, false )
        }
        d._meta = MetaProxy.Create( d._meta, field + "._meta" )
        d.default = DefaultOrDevelopProxy.Create( d.default, field + ".default" )
        d.develop = DefaultOrDevelopProxy.Create( d.develop, field + ".develop" )
        return new RequirementsLockedProxy( d )
    }
    private constructor( d: any ) {
        this._meta = d._meta
        this.default = d.default
        this.develop = d.develop
    }
}

export class MetaProxy {
    public readonly hash: HashProxy;
    public readonly requires: RequiresProxy;
    public readonly sources: SourcesEntityProxy[] | null;
    public static Parse( d: string ): MetaProxy {
        return MetaProxy.Create( JSON.parse( d ) )
    }
    public static Create( d: any, field: string = "root" ): MetaProxy {
        if ( !field ) {
            obj = d
            field = "root"
        }
        if ( d === null || d === undefined ) {
            throwNull2NonNull( field, d )
        } else if ( typeof ( d ) !== "object" ) {
            throwNotObject( field, d, false )
        } else if ( Array.isArray( d ) ) {
            throwIsArray( field, d, false )
        }
        d.hash = HashProxy.Create( d.hash, field + ".hash" )
        d.requires = RequiresProxy.Create( d.requires, field + ".requires" )
        checkArray( d.sources, field + ".sources" )
        if ( d.sources ) {
            for ( let i = 0; i < d.sources.length; i++ ) {
                d.sources[ i ] = SourcesEntityProxy.Create( d.sources[ i ], field + ".sources" + "[" + i + "]" )
            }
        }
        if ( d.sources === undefined ) {
            d.sources = null
        }
        return new MetaProxy( d )
    }
    private constructor( d: any ) {
        this.hash = d.hash
        this.requires = d.requires
        this.sources = d.sources
    }
}

export class HashProxy {
    public readonly sha256: string;
    public static Parse( d: string ): HashProxy {
        return HashProxy.Create( JSON.parse( d ) )
    }
    public static Create( d: any, field: string = "root" ): HashProxy {
        if ( !field ) {
            obj = d
            field = "root"
        }
        if ( d === null || d === undefined ) {
            throwNull2NonNull( field, d )
        } else if ( typeof ( d ) !== "object" ) {
            throwNotObject( field, d, false )
        } else if ( Array.isArray( d ) ) {
            throwIsArray( field, d, false )
        }
        checkString( d.sha256, false, field + ".sha256" )
        return new HashProxy( d )
    }
    private constructor( d: any ) {
        this.sha256 = d.sha256
    }
}

export class RequiresProxy {
    public readonly python_version: string;
    public static Parse( d: string ): RequiresProxy {
        return RequiresProxy.Create( JSON.parse( d ) )
    }
    public static Create( d: any, field: string = "root" ): RequiresProxy {
        if ( !field ) {
            obj = d
            field = "root"
        }
        if ( d === null || d === undefined ) {
            throwNull2NonNull( field, d )
        } else if ( typeof ( d ) !== "object" ) {
            throwNotObject( field, d, false )
        } else if ( Array.isArray( d ) ) {
            throwIsArray( field, d, false )
        }
        checkString( d.python_version, false, field + ".python_version" )
        return new RequiresProxy( d )
    }
    private constructor( d: any ) {
        this.python_version = d.python_version
    }
}

export class SourcesEntityProxy {
    public readonly name: string;
    public readonly url: string;
    public readonly verify_ssl: boolean;
    public static Parse( d: string ): SourcesEntityProxy {
        return SourcesEntityProxy.Create( JSON.parse( d ) )
    }
    public static Create( d: any, field: string = "root" ): SourcesEntityProxy {
        if ( !field ) {
            obj = d
            field = "root"
        }
        if ( d === null || d === undefined ) {
            throwNull2NonNull( field, d )
        } else if ( typeof ( d ) !== "object" ) {
            throwNotObject( field, d, false )
        } else if ( Array.isArray( d ) ) {
            throwIsArray( field, d, false )
        }
        checkString( d.name, false, field + ".name" )
        checkString( d.url, false, field + ".url" )
        checkBoolean( d.verify_ssl, false, field + ".verify_ssl" )
        return new SourcesEntityProxy( d )
    }
    private constructor( d: any ) {
        this.name = d.name
        this.url = d.url
        this.verify_ssl = d.verify_ssl
    }
}

export class DefaultOrDevelopProxy {
    [ key: string ]: LockedPackageVersionProxy

    public static Parse( d: string ): DefaultOrDevelopProxy {
        return DefaultOrDevelopProxy.Create( JSON.parse( d ) )
    }
    public static Create( d: any, field: string = "root" ): DefaultOrDevelopProxy {
        if ( !field ) {
            obj = d
            field = "root"
        }
        if ( d === null || d === undefined ) {
            throwNull2NonNull( field, d )
        } else if ( typeof ( d ) !== "object" ) {
            throwNotObject( field, d, false )
        } else if ( Array.isArray( d ) ) {
            throwIsArray( field, d, false )
        }
        for ( const key in d ) {
            d[ key ] = LockedPackageVersionProxy.Create( d[ key ] )
        }
        return new DefaultOrDevelopProxy( d )
    }
    private constructor( d: any ) {
        for ( const key in d ) this[ key ] = d[ key ]
    }
}


export class LockedPackageVersionProxy {
    public readonly version: string;
    public readonly hashes: string[];
    public readonly index: string | null;
    public readonly markers: string | null;
    public static Parse( d: string ): LockedPackageVersionProxy {
        return LockedPackageVersionProxy.Create( JSON.parse( d ) )
    }
    public static Create( d: any, field: string = "root" ): LockedPackageVersionProxy {
        if ( !field ) {
            obj = d
            field = "root"
        }
        if ( d === null || d === undefined ) {
            throwNull2NonNull( field, d )
        } else if ( typeof ( d ) !== "object" ) {
            throwNotObject( field, d, false )
        } else if ( Array.isArray( d ) ) {
            throwIsArray( field, d, false )
        }
        checkString( d.version, false, field + ".version" )
        checkArray( d.hashes, field + ".hashes" )
        if ( d.hashes ) {
            for ( let i = 0; i < d.hashes.length; i++ ) {
                checkString( d.hashes[ i ], false, field + ".hashes" + "[" + i + "]" )
            }
        }
        if ( d.hashes === undefined ) {
            d.hashes = null
        }
        checkString( d.index, true, field + ".index" )
        if ( d.index === undefined ) {
            d.index = null
        }
        checkString( d.markers, true, field + ".markers" )
        if ( d.markers === undefined ) {
            d.markers = null
        }
        return new LockedPackageVersionProxy( d )
    }
    private constructor( d: any ) {
        this.version = d.version
        this.hashes = d.hashes
        this.index = d.index
        this.markers = d.markers
    }
}

function throwNull2NonNull( field: string, d: any ): never {
    return errorHelper( field, d, "non-nullable object", false )
}
function throwNotObject( field: string, d: any, nullable: boolean ): never {
    return errorHelper( field, d, "object", nullable )
}
function throwIsArray( field: string, d: any, nullable: boolean ): never {
    return errorHelper( field, d, "object", nullable )
}
function checkArray( d: any, field: string ): void {
    if ( !Array.isArray( d ) && d !== null && d !== undefined ) {
        errorHelper( field, d, "array", true )
    }
}
function checkBoolean( d: any, nullable: boolean, field: string ): void {
    if ( typeof ( d ) !== "boolean" && ( !nullable || ( nullable && d !== null && d !== undefined ) ) ) {
        errorHelper( field, d, "boolean", nullable )
    }
}
function checkString( d: any, nullable: boolean, field: string ): void {
    if ( typeof ( d ) !== "string" && ( !nullable || ( nullable && d !== null && d !== undefined ) ) ) {
        errorHelper( field, d, "string", nullable )
    }
}
function errorHelper( field: string, d: any, type: string, nullable: boolean ): never {
    if ( nullable ) {
        type += ", null, or undefined"
    }
    throw new TypeError( "Expected " + type + " at " + field + " but found:\n" + JSON.stringify( d ) + "\n\nFull object:\n" + JSON.stringify( obj ) )
}
