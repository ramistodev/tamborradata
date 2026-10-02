import 'server-only';

export interface SchoolRow {
  id: string;
  canonical_name: string;
  school_key: string;
}

export interface SchoolsParams {
  query?: string;
}
