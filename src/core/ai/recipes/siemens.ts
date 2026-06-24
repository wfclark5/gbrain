import type { Recipe } from '../types.ts';

/**
 * Siemens AI — OpenAI-compatible endpoint for Zhipu GLM models.
 *
 * Serves chat, expansion, and embedding models via https://api.siemens.com/llm/v1.
 * Auth via SIEMENS_LLM_API_KEY (Bearer token).
 *
 * Embeddings are served directly on Siemens for Qwen/BGE embedding families.
 * NOTE: current Siemens embedding models exposed here are fixed-dimension
 * (no matryoshka resizing via `dimensions`).
 */
export const siemens: Recipe = {
  id: 'siemens',
  name: 'Siemens AI',
  tier: 'openai-compat',
  implementation: 'openai-compatible',
  base_url_default: 'https://api.siemens.com/llm/v1',
  auth_env: {
    required: ['SIEMENS_LLM_API_KEY'],
    optional: ['SIEMENS_LLM_BASE_URL'],
    setup_url: 'https://api.siemens.com',
  },
  touchpoints: {
    embedding: {
      // Exposed by Siemens gateway today (verified via /models).
      models: ['qwen3-embedding-0.6b', 'qwen3-embedding-8b', 'bge-m3'],
      // qwen3-embedding-0.6b and bge-m3 are 1024d; qwen3-embedding-8b is 4096d.
      // Users should pass the exact schema width at init/reinit time.
      default_dims: 1024,
      // Endpoint supports array inputs; backend caps are provider-managed.
      no_batch_cap: true,
      price_last_verified: '2026-06-24',
    },
    chat: {
      models: ['glm-5-preview', 'glm-5.2'],
      supports_tools: true,
      supports_subagent_loop: false,
      supports_prompt_cache: false,
      price_last_verified: '2026-06-23',
    },
    expansion: {
      models: ['glm-5-preview', 'glm-5.2'],
      price_last_verified: '2026-06-23',
    },
  },
  setup_hint:
    'Set SIEMENS_LLM_API_KEY (Bearer token for api.siemens.com). Use siemens:qwen-3.6-27b / siemens:glm-5-preview for chat+expansion and siemens:qwen3-embedding-0.6b (1024d), siemens:bge-m3 (1024d), or siemens:qwen3-embedding-8b (4096d) for embeddings.',
};
