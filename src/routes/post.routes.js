import {Router} from 'express'
import { CreatePost, getPost, getPosts, updatePost } from '../controllers/post.controllers.js'

const router = Router()

router.post('/post', CreatePost)

router.get('/posts', getPosts)

router.get('/post/:id', getPost)

router.put('/post/:id', updatePost)

export default router