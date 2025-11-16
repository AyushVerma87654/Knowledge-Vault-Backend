import fs from 'fs'
import path from 'path'
import mammoth from 'mammoth'
import { createWorker } from 'tesseract.js'

export default class TextExtractor {
  static async extractText(filePath: string, ext?: string): Promise<string> {
    const extension = ext ? `.${ext.toLowerCase()}` : path.extname(filePath).toLowerCase()
    if (['.txt', '.md'].includes(extension)) return this.extractTxt(filePath)
    if (extension === '.docx') return this.extractDocx(filePath)
    if (['.png', '.jpg', '.jpeg', '.webp'].includes(extension))
      return this.extractImageOCR(filePath)
    return ''
  }

  static async extractTxt(filePath: string): Promise<string> {
    return fs.readFileSync(filePath, 'utf-8')
  }

  static async extractDocx(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath })
    return result.value || ''
  }

  static async extractImageOCR(filePath: string): Promise<string> {
    return this.extractOCR(filePath)
  }

  private static async extractOCR(filePath: string): Promise<string> {
    const worker = await createWorker('eng')
    const { data } = await worker.recognize(filePath)
    await worker.terminate()
    return data.text || ''
  }
}
