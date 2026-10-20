export type SupabaseError = { message: string; code?: string; details?: string; hint?: string };
export type SupabaseResult = { data: unknown; error: SupabaseError | null; count?: number | null };

export const ok = (data: unknown, count?: number | null): SupabaseResult =>
  count === undefined ? { data, error: null } : { data, error: null, count };

export const fail = (message: string, code?: string): SupabaseResult => ({
  data: null,
  error: code ? { message, code } : { message },
});

export interface RecordedCall {
  method: string;
  args: unknown[];
}

export interface RecordedQuery {
  kind: 'from' | 'rpc';
  target: string; // table name or rpc name
  rpcArgs?: unknown; // second argument of rpc(name, args)
  calls: RecordedCall[]; // chain methods in call order
  awaited: boolean;
}

export class SupabaseMock {
  /** Every query started, in order. */
  readonly queries: RecordedQuery[] = [];
  private readonly fromQueues = new Map<string, SupabaseResult[]>();
  private readonly rpcQueues = new Map<string, SupabaseResult[]>();

  /** Pass this where the app expects the supabase client. */
  readonly client: { from(table: string): any; rpc(name: string, args?: unknown): any } = {
    from: (table: string) => this.start('from', table),
    rpc: (name: string, args?: unknown) => this.start('rpc', name, args),
  };

  queueFrom(table: string, ...results: SupabaseResult[]): void {
    const queue = this.fromQueues.get(table) ?? [];
    queue.push(...results);
    this.fromQueues.set(table, queue);
  }

  queueRpc(name: string, ...results: SupabaseResult[]): void {
    const queue = this.rpcQueues.get(name) ?? [];
    queue.push(...results);
    this.rpcQueues.set(name, queue);
  }

  queriesFor(target: string): RecordedQuery[] {
    return this.queries.filter((query) => query.target === target);
  }

  lastQuery(target?: string): RecordedQuery {
    const list = target ? this.queriesFor(target) : this.queries;
    const last = list[list.length - 1];
    if (!last) throw new Error(`[supabaseMock] No query recorded${target ? ` for "${target}"` : ''}`);
    return last;
  }

  methods(query: RecordedQuery): string[] {
    return query.calls.map((call) => call.method);
  }

  argsOf(query: RecordedQuery, method: string): unknown[][] {
    return query.calls.filter((call) => call.method === method).map((call) => call.args);
  }

  pending(): string[] {
    const lines: string[] = [];
    for (const [table, queue] of this.fromQueues) {
      if (queue.length > 0) lines.push(`from:${table} (${queue.length} left)`);
    }
    for (const [name, queue] of this.rpcQueues) {
      if (queue.length > 0) lines.push(`rpc:${name} (${queue.length} left)`);
    }
    return lines;
  }

  assertNoPending(): void {
    const pending = this.pending();
    if (pending.length > 0) throw new Error(`[supabaseMock] Unconsumed results: ${pending.join(', ')}`);
  }

  reset(): void {
    this.fromQueues.clear();
    this.rpcQueues.clear();
    this.queries.length = 0;
  }

  private start(kind: 'from' | 'rpc', target: string, rpcArgs?: unknown): any {
    const query: RecordedQuery = {
      kind,
      target,
      calls: [],
      awaited: false,
      ...(kind === 'rpc' ? { rpcArgs } : {}),
    };
    this.queries.push(query);

    const chain: any = new Proxy(
      {},
      {
        get: (_object, property) => {
          if (property === 'then') {
            return (onFulfilled?: (value: SupabaseResult) => unknown, onRejected?: (reason: unknown) => unknown) =>
              this.settle(query).then(onFulfilled, onRejected);
          }
          if (typeof property === 'symbol') return undefined;
          return (...args: unknown[]) => {
            query.calls.push({ method: property, args });
            return chain;
          };
        },
      },
    );
    return chain;
  }

  private settle(query: RecordedQuery): Promise<SupabaseResult> {
    query.awaited = true;
    const queues = query.kind === 'from' ? this.fromQueues : this.rpcQueues;
    const next = queues.get(query.target)?.shift();
    if (!next) {
      const seen = this.queries.map((item) => `${item.kind}:${item.target}`).join(', ');
      return Promise.reject(
        new Error(
          `[supabaseMock] Unexpected ${query.kind} "${query.target}": no result queued. Queries so far: [${seen}]`,
        ),
      );
    }
    return Promise.resolve(next);
  }
}

export function createSupabaseMock(): SupabaseMock {
  return new SupabaseMock();
}
