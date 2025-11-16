import { pipeline, FeatureExtractionPipeline } from '@xenova/transformers'

export default class EmbeddingService {
  private static embedderPromise: Promise<FeatureExtractionPipeline> = pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2'
  )

  public static async embedText(text: string): Promise<number[]> {
    if (!text || !text.trim()) return []
    try {
      const embedder = await this.embedderPromise
      const result = (await embedder(text, {
        pooling: 'mean',
        normalize: true,
      })) as any as { data: Record<string, number> }
      return Object.values(result.data)
    } catch (err: any) {
      console.error('Embedding generation failed:', err?.message)
      return []
    }
  }
}
