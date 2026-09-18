export type BenchRow = {
  name: string;
  iterations: number;
  nsPerOp: number;
  opsPerSec: number;
  checksum: string;
};

export function timeKernel(
  name: string,
  run: () => string,
  opts?: { warmup?: number; iterations?: number },
): BenchRow {
  const warmup = opts?.warmup ?? 30;
  const iterations = opts?.iterations ?? 400;
  const first = run();
  for (let i = 0; i < warmup; i++) {
    if (run() !== first) {
      throw new Error(`${name}: checksum drifted during warmup (non-deterministic or dropped work)`);
    }
  }
  const t0 = performance.now();
  for (let i = 0; i < iterations; i++) {
    if (run() !== first) {
      throw new Error(`${name}: checksum drifted during timing`);
    }
  }
  const elapsedMs = performance.now() - t0;
  const nsPerOp = (elapsedMs * 1e6) / iterations;
  return {
    name,
    iterations,
    nsPerOp,
    opsPerSec: nsPerOp === 0 ? Number.POSITIVE_INFINITY : 1e9 / nsPerOp,
    checksum: first,
  };
}

export function formatRow(row: BenchRow): string {
  const ns = row.nsPerOp.toFixed(0).padStart(10);
  const ops = row.opsPerSec.toFixed(0).padStart(10);
  return `${row.name.padEnd(20)} ${ns} ns/op  ${ops} ops/s  xsum=${row.checksum}`;
}
