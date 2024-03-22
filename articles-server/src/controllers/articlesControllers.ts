import { RequestHandler } from "express"
import ArticleModel from '../models/articleModel'
import createHttpError from "http-errors"

export const getArticles: RequestHandler = async (req, res, next) => {
  try {
    const articles = await ArticleModel.find().exec()
    res.status(200).json(articles)
  } catch (error) {
    next(error)
  }
}

export const getArticle: RequestHandler = async (req, res, next) => {
  const articleId = req.params.articleId

  try {
    const article = await ArticleModel.findById(articleId).exec()

    if (!article) {
      throw createHttpError(404, 'Article not found')
    }

    res.status(200).json(article)
  } catch (error) {
    next(error)
  }
}

interface CreateArticleRequest {
  title?: string
  content?: string
}

export const createArticle: RequestHandler<unknown, unknown, CreateArticleRequest, unknown> = async (req, res, next) => {
  const title = req.body.title
  const content = req.body.content

  try {
    if (!title || !content) {
      throw createHttpError(400, 'Title and content are required')
    }

    const newArticle = await ArticleModel.create({
      title: title,
      content: content
    })
    res.status(201).json(newArticle)
  } catch (error) {
    next(error)
  }
}

interface UpdateArticleParams {
  articleId: string
}

interface UpdateArticleRequest {
  title?: string
  content?: string
}

export const updateArticle: RequestHandler<UpdateArticleParams, unknown, UpdateArticleRequest, unknown> = async (req, res, next) => {
  const articleId = req.params.articleId
  const newTitle = req.body.title
  const newContent = req.body.content

  try {
    if (!newTitle || !newContent) {
      throw createHttpError(400, 'Title and content are required')
    }

    const article = await ArticleModel.findById(articleId).exec()

    if (!article) {
      throw createHttpError(404, 'Article not found')
    }

    article.title = newTitle
    article.content = newContent
    const updatedArticle = await article.save()

    res.status(200).json(updatedArticle)
  } catch (error) {
    next(error)
  }
}

export const deleteArticle: RequestHandler = async (req, res, next) => {
  const articleId = req.params.articleId

  try {
    const article = await ArticleModel.findById(articleId).exec()

    if (!article) {
      throw createHttpError(404, 'Article not found')
    }

    await ArticleModel.deleteOne({ _id: articleId }).exec()
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}