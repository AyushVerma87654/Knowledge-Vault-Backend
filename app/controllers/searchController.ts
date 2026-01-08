import { supabase } from '#start/supabase'
import EmbeddingService from '#services/embeddingService'
import { HttpContext } from '@adonisjs/core/http'

export default class SearchController {
  public async search({ params, response }: HttpContext) {
    const query = params.query?.trim()

    if (!query) {
      return response.badRequest({ error: 'Query is required' })
    }

    // Embedding is still needed for semantic fallback
    const embedding = await EmbeddingService.embedText(query)

    // 🔴 IMPORTANT: function name & param names must match SQL exactly
    const { data, error } = await supabase.rpc('match_documents_hybrid', {
      query_embedding: embedding,
      keyword: query,
      match_count: 10,
    })

    if (error) {
      console.error('Supabase RPC error:', error)
      return response.internalServerError({ error: error.message })
    }

    return response.json({
      responseDetails: {
        searchResults: (data ?? []).map((row: any) => ({
          id: row.doc_id,
          title: row.doc_title,
          content: row.doc_content,
          fileUploadUrl: row.doc_file_upload_url,
          similarity: row.similarity,
        })),
      },
    })
  }
}
