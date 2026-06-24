/**
 * skillpack/target-subdir.ts — helpers for `gbrain skillpack scaffold --target-subdir`.
 *
 * The scaffold contract stays workspace-rooted:
 *   - skill + shared-dep files under `skills/`
 *   - paired source files at their declared workspace-relative paths
 *
 * `--target-subdir` rewrites ONLY the `skills/...` targets to
 * `skills/<subdir>/...` and leaves non-skill paths (paired sources) untouched.
 */

export class TargetSubdirError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TargetSubdirError';
  }
}

/**
 * Normalize user input for `--target-subdir`.
 *
 * Accepted examples:
 *   - "gbrain"
 *   - "gbrain/custom"
 *   - "skills/gbrain"   (normalized to "gbrain")
 */
export function normalizeTargetSubdir(raw?: string | null): string | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new TargetSubdirError('`--target-subdir` cannot be empty.');
  }
  if (trimmed.includes('\0')) {
    throw new TargetSubdirError('`--target-subdir` cannot contain null bytes.');
  }

  // Normalize separators to forward slash for deterministic rel-path logic.
  let normalized = trimmed.replace(/\\+/g, '/');
  normalized = normalized.replace(/^\/+/, '').replace(/\/+$/, '');
  if (normalized.startsWith('skills/')) {
    normalized = normalized.slice('skills/'.length);
  } else if (normalized === 'skills') {
    normalized = '';
  }

  const parts = normalized.split('/').filter(Boolean);
  if (parts.length === 0) {
    throw new TargetSubdirError(
      '`--target-subdir` must contain at least one non-empty path segment.',
    );
  }
  for (const part of parts) {
    if (part === '.' || part === '..') {
      throw new TargetSubdirError(
        '`--target-subdir` cannot contain "." or ".." segments.',
      );
    }
  }
  return parts.join('/');
}

/**
 * Rewrite workspace-relative scaffold targets:
 *   skills/...  -> skills/<subdir>/...
 *   everything else unchanged.
 */
export function remapSkillTarget(relWorkspaceTarget: string, targetSubdir: string | null): string {
  if (!targetSubdir) return relWorkspaceTarget;
  if (relWorkspaceTarget === 'skills') return `skills/${targetSubdir}`;
  if (!relWorkspaceTarget.startsWith('skills/')) return relWorkspaceTarget;
  const rest = relWorkspaceTarget.slice('skills/'.length);
  return `skills/${targetSubdir}/${rest}`;
}
