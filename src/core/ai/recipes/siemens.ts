import type { Recipe } from '../types.ts';

/**
 * Siemens AI — OpenAI-compatible endpoint for Zhipu GLM models.
 *
 * Serves chat and expansion models via https://api.siemens.com/llm/v1.
 * Auth via SIEMENS_LLM_API_KEY (Bearer token).
 *
 * Embeddings are NOT served here; use litellm: for embeddings (Gemini via
 * the SparkAI LiteLLM proxy).
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
    chat: {
      models: ['glm-5-preview', 'glm-5.2'],
      supports_tools: true,
      supports_subagent_loop: false,
      supports_prompt_cache: false,
      price_last_verified: '2026-06-23',
    },
    expansion: {
      models: ['glm-5-preview', 'glm-5.2'],
      supports_tools: false,
      price_last_verified: '2026-06-23',
    },
  },
  setup_hint:
    'Set SIEMENS_LLM_API_KEY (Bearer token for api.siemens.com). Use siemens:glm-5-preview for chat and expansion.',
};
