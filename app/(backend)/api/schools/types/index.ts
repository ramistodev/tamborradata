import 'server-only';

export interface SchoolRow {
  canonical_name: string;
  school_key: string;
}

export interface SchoolsParams {
  query?: string;
}
