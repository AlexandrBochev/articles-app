import express from "express"
import { createArticle, deleteArticle, getArticle, getArticles, updateArticle } from "../controllers/articlesControllers"

const router = express.Router()

router.get('/', getArticles)

router.get('/:articleId', getArticle)

router.post('/', createArticle)

router.patch('/:articleId', updateArticle)

router.delete('/:articleId', deleteArticle)

export default router