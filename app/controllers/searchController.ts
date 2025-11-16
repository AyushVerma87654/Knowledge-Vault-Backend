import { supabase } from '#start/supabase'
import EmbeddingService from '#services/embeddingService'
import { HttpContext } from '@adonisjs/core/http'

export default class SearchController {
  public async search({ params, response }: HttpContext) {
    const query = params.query
    const embedding = await EmbeddingService.embedText(query)
    const threshold = query.length < 5 ? 0.85 : 0.9
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: 10,
      keyword: query,
    })
    if (error) {
      console.error('Supabase RPC error:', error)
      return response.status(500).json({ error: error.message })
    }
    return response.json({
      responseDetails: {
        searchResults: data.map((row: any) => ({
          id: row.doc_id,
          title: row.doc_title,
          content: row.doc_content,
          fileUploadUrl: row.doc_file_url,
          similarity: row.similarity,
        })),
      },
    })
  }
}
