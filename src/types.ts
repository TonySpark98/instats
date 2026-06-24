export interface Entry {
  username: string;
  href: string;
  ts: number;
  count?: number;
}

export type Buckets = Record<string, Entry[]>;

export interface LogItem {
  name: string;
  cat: string;
  count: number;
}

export interface ScanItem {
  file: string;
  nb: string;
  emoji: string;
  label: { it: string; en: string };
  group: string;
  count: number | null;
}

export interface InteractionStat {
  username: string;
  comment: number;
  likedComment: number;
  storyLike: number;
  total: number;
  ts: number;
}

export type Interactions = Record<string, InteractionStat>;

export interface ReadResult {
  buckets: Buckets;
  log: LogItem[];
  scan: ScanItem[];
  profile: Record<string, string>;
  interactions: Interactions;
}

export interface Derived {
  notFollowingBack: Entry[];
  fans: Entry[];
  mutuals: Entry[];
}

export interface TabDef {
  id: string;
  label: string;
  items: Entry[];
  desc: string;
  action?: string;
}

export type Lang = 'it' | 'en';

export interface AppState {
  data: Buckets | null;
  derived: Derived | null;
  active: string;
  query: string;
  sort: string;
  _virtual: TabDef | null;
  _cmp: Record<string, string[]> | null;
  _log?: LogItem[];
  scan?: ScanItem[];
  profile?: Record<string, string>;
  _scanSorted?: ScanItem[];
  hideOpened?: boolean;
  interactions?: Interactions;
}
