import { KernelInfo, LanguageInfo, KernelSpec } from './types/kernel';
export { KernelInfo, LanguageInfo, KernelSpec }

let obj: any = null;
export class KernelInfoProxy {
    public readonly status: string;
    public readonly protocol_version: string;
    public readonly implementation: string;
    public readonly implementation_version: string;
    public readonly language_info: LanguageInfoProxy;
    public readonly banner: string;
    public readonly help_links: HelpLinksEntityProxy[] | null;
    public static Parse( d: string ): KernelInfoProxy {
        return KernelInfoProxy.Create( JSON.parse( d ) );
    }
    public static Create( d: any, field: string = 'root' ): KernelInfoProxy {
        if ( !field ) {
            obj = d;
            field = "root";
        }
        if ( d === null || d === undefined ) {
            throwNull2NonNull( field, d );
        } else if ( typeof ( d ) !== 'object' ) {
            throwNotObject( field, d, false );
        } else if ( Array.isArray( d ) ) {
            throwIsArray( field, d, false );
        }
        checkString( d.status, false, field + ".status" );
        checkString( d.protocol_version, false, field + ".protocol_version" );
        checkString( d.implementation, false, field + ".implementation" );
        checkString( d.implementation_version, false, field + ".implementation_version" );
        d.language_info = LanguageInfoProxy.Create( d.language_info, field + ".language_info" );
        checkString( d.banner, false, field + ".banner" );
        checkArray( d.help_links, field + ".help_links" );
        if ( d.help_links ) {
            for ( let i = 0; i < d.help_links.length; i++ ) {
                d.help_links[ i ] = HelpLinksEntityProxy.Create( d.help_links[ i ], field + ".help_links" + "[" + i + "]" );
            }
        }
        if ( d.help_links === undefined ) {
            d.help_links = null;
        }
        return new KernelInfoProxy( d );
    }
    private constructor( d: any ) {
        this.status = d.status;
        this.protocol_version = d.protocol_version;
        this.implementation = d.implementation;
        this.implementation_version = d.implementation_version;
        this.language_info = d.language_info;
        this.banner = d.banner;
        this.help_links = d.help_links;
    }
}

export class LanguageInfoProxy {
    public readonly name: string;
    public readonly version: string;
    public readonly mimetype: string;
    public readonly codemirror_mode: CodemirrorModeProxy;
    public readonly pygments_lexer: string;
    public readonly nbconvert_exporter: string;
    public readonly file_extension: string;
    public static Parse( d: string ): LanguageInfoProxy {
        return LanguageInfoProxy.Create( JSON.parse( d ) );
    }
    public static Create( d: any, field: string = 'root' ): LanguageInfoProxy {
        if ( !field ) {
            obj = d;
            field = "root";
        }
        if ( d === null || d === undefined ) {
            throwNull2NonNull( field, d );
        } else if ( typeof ( d ) !== 'object' ) {
            throwNotObject( field, d, false );
        } else if ( Array.isArray( d ) ) {
            throwIsArray( field, d, false );
        }
        checkString( d.name, false, field + ".name" );
        checkString( d.version, false, field + ".version" );
        checkString( d.mimetype, false, field + ".mimetype" );
        d.codemirror_mode = CodemirrorModeProxy.Create( d.codemirror_mode, field + ".codemirror_mode" );
        checkString( d.pygments_lexer, false, field + ".pygments_lexer" );
        checkString( d.nbconvert_exporter, false, field + ".nbconvert_exporter" );
        checkString( d.file_extension, false, field + ".file_extension" );
        return new LanguageInfoProxy( d );
    }
    private constructor( d: any ) {
        this.name = d.name;
        this.version = d.version;
        this.mimetype = d.mimetype;
        this.codemirror_mode = d.codemirror_mode;
        this.pygments_lexer = d.pygments_lexer;
        this.nbconvert_exporter = d.nbconvert_exporter;
        this.file_extension = d.file_extension;
    }
}

export class CodemirrorModeProxy {
    public readonly name: string;
    public readonly version: number;
    public static Parse( d: string ): CodemirrorModeProxy {
        return CodemirrorModeProxy.Create( JSON.parse( d ) );
    }
    public static Create( d: any, field: string = 'root' ): CodemirrorModeProxy {
        if ( !field ) {
            obj = d;
            field = "root";
        }
        if ( d === null || d === undefined ) {
            throwNull2NonNull( field, d );
        } else if ( typeof ( d ) !== 'object' ) {
            throwNotObject( field, d, false );
        } else if ( Array.isArray( d ) ) {
            throwIsArray( field, d, false );
        }
        checkString( d.name, false, field + ".name" );
        checkNumber( d.version, false, field + ".version" );
        return new CodemirrorModeProxy( d );
    }
    private constructor( d: any ) {
        this.name = d.name;
        this.version = d.version;
    }
}

export class HelpLinksEntityProxy {
    public readonly text: string;
    public readonly url: string;
    public static Parse( d: string ): HelpLinksEntityProxy {
        return HelpLinksEntityProxy.Create( JSON.parse( d ) );
    }
    public static Create( d: any, field: string = 'root' ): HelpLinksEntityProxy {
        if ( !field ) {
            obj = d;
            field = "root";
        }
        if ( d === null || d === undefined ) {
            throwNull2NonNull( field, d );
        } else if ( typeof ( d ) !== 'object' ) {
            throwNotObject( field, d, false );
        } else if ( Array.isArray( d ) ) {
            throwIsArray( field, d, false );
        }
        checkString( d.text, false, field + ".text" );
        checkString( d.url, false, field + ".url" );
        return new HelpLinksEntityProxy( d );
    }
    private constructor( d: any ) {
        this.text = d.text;
        this.url = d.url;
    }
}

function throwNull2NonNull( field: string, d: any ): never {
    return errorHelper( field, d, "non-nullable object", false );
}
function throwNotObject( field: string, d: any, nullable: boolean ): never {
    return errorHelper( field, d, "object", nullable );
}
function throwIsArray( field: string, d: any, nullable: boolean ): never {
    return errorHelper( field, d, "object", nullable );
}
function checkArray( d: any, field: string ): void {
    if ( !Array.isArray( d ) && d !== null && d !== undefined ) {
        errorHelper( field, d, "array", true );
    }
}
function checkNumber( d: any, nullable: boolean, field: string ): void {
    if ( typeof ( d ) !== 'number' && ( !nullable || ( nullable && d !== null && d !== undefined ) ) ) {
        errorHelper( field, d, "number", nullable );
    }
}
function checkString( d: any, nullable: boolean, field: string ): void {
    if ( typeof ( d ) !== 'string' && ( !nullable || ( nullable && d !== null && d !== undefined ) ) ) {
        errorHelper( field, d, "string", nullable );
    }
}
function errorHelper( field: string, d: any, type: string, nullable: boolean ): never {
    if ( nullable ) {
        type += ", null, or undefined";
    }
    throw new TypeError( 'Expected ' + type + " at " + field + " but found:\n" + JSON.stringify( d ) + "\n\nFull object:\n" + JSON.stringify( obj ) );
}