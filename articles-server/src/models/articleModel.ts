import { InferSchemaType, Schema, model } from "mongoose"

const articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
}, { timestamps: true })

type Article = InferSchemaType<typeof articleSchema>

export default model<Article>('Article', articleSchema)
