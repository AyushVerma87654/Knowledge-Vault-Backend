import { supabase } from '#start/supabase'
import EmbeddingService from '#services/embeddingService'
import TextExtractor from '#services/textExtractor'
import { HttpContext } from '@adonisjs/core/http'
import fs from 'fs'

export default class IndexController {
  public async index({ request, response }: HttpContext) {
    const file = request.file('file')
    if (!file) return response.json({ message: 'Send the file too' })
    console.log('file', file)
    const fileName = file.clientName
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    console.log('timestamp', timestamp)
    const filePath = `documents/${fileName}-${timestamp}`
    const fileData = fs.readFileSync(file.tmpPath!)
    await supabase.storage.from('files').upload(filePath, fileData, { upsert: true })
    const { data } = supabase.storage.from('files').getPublicUrl(filePath)
    const text = await TextExtractor.extractText(file.tmpPath!, file.extname!)
    const embedding = await EmbeddingService.embedText(text)
    const { error: fileError } = await supabase
      .from('documents')
      .insert({
        title: file.clientName,
        content: text,
        embedding,
        file_upload_url: data.publicUrl,
      })
      .select()
      .single()
    if (fileError) return response.status(400).json({ error: 'Failed Indexing' })
    return response.json({ responseDetails: { message: 'Indexed' } })
  }
}
