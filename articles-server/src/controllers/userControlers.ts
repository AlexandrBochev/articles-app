import { RequestHandler } from "express"
import createHttpError from "http-errors"
import UserModel from "../models/userModel"
import bcrypt from "bcrypt"

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId
  try {
    if (!authenticatedUserId) {
      throw createHttpError(401, 'Not authenticated')
    }

    const user = await UserModel.findById(authenticatedUserId).select('+email').exec()

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }

}

interface SignUpRequest {
  username?: string
  email?: string
  password?: string

}

export const signUp: RequestHandler<unknown, unknown, SignUpRequest, unknown> = async (req, res, next) => {
  const username = req.body.username
  const email = req.body.email
  const passwordRaw = req.body.password

  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, 'Username, email, and password are required')
    }

    const existingUsername = await UserModel.findOne({ username: username }).exec()
    if (existingUsername) {
      throw createHttpError(409, 'Username already exists')
    }

    const existingEmail = await UserModel.findOne({ email: email }).exec()
    if (existingEmail) {
      throw createHttpError(409, 'Email already exists')
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10)

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: passwordHashed
    })

    req.session.userId = newUser._id

    res.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
}

interface LoginRequest {
  username?: string
  password?: string
}

export const login: RequestHandler<unknown, unknown, LoginRequest, unknown> = async (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  try {
    if (!username || !password) {
      throw createHttpError(400, 'Username and password are required')
    }

    const user = await UserModel.findOne({ username: username }).select('+password +email').exec()
    if (!user) {
      throw createHttpError(401, 'Invalid email or password')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw createHttpError(401, 'Invalid email or password')
    }

    req.session.userId = user._id

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error)
    } else {
      res.sendStatus(200)
    }
  })
}