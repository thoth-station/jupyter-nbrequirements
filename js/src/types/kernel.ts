export interface KernelInfo {
  status: string;
  protocol_version: string;
  implementation: string;
  implementation_version: string;
  language_info: LanguageInfo;
  banner: string;
  help_links?: (HelpLinksEntity)[] | null;
}
export interface LanguageInfo {
  name: string;
  version: string;
  mimetype: string;
  codemirror_mode: CodemirrorMode;
  pygments_lexer: string;
  nbconvert_exporter: string;
  file_extension: string;
}
export interface CodemirrorMode {
  name: string;
  version: number;
}
export interface HelpLinksEntity {
  text: string;
  url: string;
}
