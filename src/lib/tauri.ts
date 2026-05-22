import type {
  ClassificationResult,
  TransformResult,
  RandomConstraints,
  TwelveToneMatrixResult,
  ForteTableEntry,
} from "../types/music";

interface TauriGlobal {
  core: {
    invoke: (cmd: string, args?: Record<string, unknown>) => Promise<unknown>;
  };
}

function getTauri(): TauriGlobal | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).__TAURI__;
}

export async function classifySet(
  notes: number[],
  ordered: boolean
): Promise<ClassificationResult> {
  const tauri = getTauri();
  if (!tauri) throw new Error("Tauri not available");
  return tauri.core.invoke("classify_set", { notes, ordered }) as Promise<ClassificationResult>;
}

export async function transform(
  notes: number[],
  ordered: boolean,
  transformType: string,
  n: number
): Promise<TransformResult> {
  const tauri = getTauri();
  if (!tauri) throw new Error("Tauri not available");
  return tauri.core.invoke("transform", {
    notes,
    ordered,
    transformType,
    n,
  }) as Promise<TransformResult>;
}

export async function generateRandom(
  constraints: RandomConstraints
): Promise<number[]> {
  const tauri = getTauri();
  if (!tauri) throw new Error("Tauri not available");
  return tauri.core.invoke("generate_random", {
    constraints: {
      cardinality: constraints.cardinality ?? null,
      require_t_symmetry: constraints.requireTSymmetry ?? false,
      require_i_symmetry: constraints.requireISymmetry ?? false,
    },
  }) as Promise<number[]>;
}

export async function getForteTable(): Promise<ForteTableEntry[]> {
  const tauri = getTauri();
  if (!tauri) throw new Error("Tauri not available");
  return tauri.core.invoke("get_forte_table") as Promise<ForteTableEntry[]>;
}

export async function computeTwelveToneMatrix(
  primeRow: number[]
): Promise<TwelveToneMatrixResult> {
  const tauri = getTauri();
  if (!tauri) throw new Error("Tauri not available");
  return tauri.core.invoke("compute_twelve_tone_matrix", {
    primeRow,
  }) as Promise<TwelveToneMatrixResult>;
}

export async function writeFile(
  path: string,
  contents: number[]
): Promise<void> {
  const tauri = getTauri();
  if (!tauri) throw new Error("Tauri not available");
  return tauri.core.invoke("write_file", { path, contents }) as Promise<void>;
}
