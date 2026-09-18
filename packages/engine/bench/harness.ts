import type { KernelName } from "./workload";

export type BenchReport = {
  name: KernelName;
  checksum: string;
  iterationsPerSample: number;
  samples: number[];
  medianNs: number;
  minNs: number;
  maxNs: number;
};

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length === 0) return 0;
  if (sorted.length % 2 === 1) return sorted[mid]!;
  return (sorted[mid - 1]! + sorted[mid]!) / 2;
}

export function sampleKernel(
  name: KernelName,
  run: () => string,
  opts?: { warmup?: number; samples?: number; iterationsPerSample?: number },
): BenchReport {
  const warmup = opts?.warmup ?? 3;
  const sampleCount = opts?.samples ?? 7;
  const iterationsPerSample = opts?.iterationsPerSample ?? 40;
  const first = run();
  for (let i = 0; i < warmup; i++) {
    if (run() !== first) {
      throw new Error(`${name}: digest drifted during warmup (non-deterministic or dropped work)`);
    }
  }
  const samples: number[] = [];
  for (let s = 0; s < sampleCount; s++) {
    const t0 = performance.now();
    for (let i = 0; i < iterationsPerSample; i++) {
      if (run() !== first) {
        throw new Error(`${name}: digest drifted during sample ${s}`);
      }
    }
    const nsPerOp = ((performance.now() - t0) * 1e6) / iterationsPerSample;
    samples.push(nsPerOp);
  }
  return {
    name,
    checksum: first,
    iterationsPerSample,
    samples,
    medianNs: median(samples),
    minNs: Math.min(...samples),
    maxNs: Math.max(...samples),
  };
}

export function formatReport(row: BenchReport): string {
  const samples = row.samples.map((ns) => ns.toFixed(0)).join(",");
  return `${row.name.padEnd(20)} median=${row.medianNs.toFixed(0).padStart(10)} ns/op  min=${row.minNs.toFixed(0)}  max=${row.maxNs.toFixed(0)}  n=${row.samples.length}  iters=${row.iterationsPerSample}  xsum=${row.checksum.slice(0, 16)}…  samples=${samples}`;
}
