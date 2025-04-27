// Mock database implementation using in-memory storage
// In a real application, you would use a database like PostgreSQL, MongoDB, etc.

import { hash, compare } from "bcryptjs"
// import { DEFAULT_PAGE_SIZE } from "@/constants";
// import prisma from "./prisma";

type Sort = "asc" | "desc";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum ContentType {
  MOVIE = "MOVIE",
  SERIES = "SERIES",
  ANIMATION = "ANIMATION",
}

export interface User {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  password: string
  image: string | null
  role: UserRole
  bio: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Content {
  id: string
  title: string
  description: string
  type: ContentType
  posterUrl: string
  year: string
  rating: string
  genres: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Series extends Content {
  type: ContentType.SERIES
  seasons: Season[]
}

export interface Season {
  id: string
  seasonNumber: number
  title: string
  posterUrl: string
  contentId: string
  episodes: Episode[]
}

export interface Episode {
  id: string
  episodeNumber: number
  title: string
  description: string
  duration: string
  thumbnailUrl: string
  seasonId: string
}

export interface Watchlist {
  id: string
  userId: string
  contentId: string
  addedAt: Date
}

export interface VerificationToken {
  identifier: string
  token: string
  expires: Date
}

// In-memory storage
const users: User[] = []
const contents: (Content | Series)[] = []
let watchlists: Watchlist[] = []
let verificationTokens: VerificationToken[] = []

// Helper function to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15)

// User functions
export async function findUserByEmail(email: string): Promise<User | null> {
  return users.find((user) => user.email === email) || null
}

export async function createUser(data: Partial<User>): Promise<User> {
  const id = generateId()
  const now = new Date()

  const newUser: User = {
    id,
    name: data.name || null,
    email: data.email!,
    emailVerified: data.emailVerified || null,
    password: data.password!,
    image: data.image || null,
    role: data.role || UserRole.USER,
    bio: data.bio || null,
    createdAt: now,
    updatedAt: now,
  }

  users.push(newUser)
  return newUser
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  const index = users.findIndex((user) => user.id === id)
  if (index === -1) return null

  users[index] = { ...users[index], ...data, updatedAt: new Date() }
  return users[index]
}

// Verification token functions
export async function createVerificationToken(data: Omit<VerificationToken, "id">): Promise<VerificationToken> {
  const newToken: VerificationToken = {
    identifier: data.identifier,
    token: data.token,
    expires: data.expires,
  }

  verificationTokens.push(newToken)
  return newToken
}

export async function findVerificationToken(identifier: string, token: string): Promise<VerificationToken | null> {
  return verificationTokens.find((vt) => vt.identifier === identifier && vt.token === token) || null
}

export async function deleteVerificationToken(identifier: string, token: string): Promise<void> {
  verificationTokens = verificationTokens.filter((vt) => !(vt.identifier === identifier && vt.token === token))
}

// Content functions
export async function getAllContent(): Promise<Content[]> {
  return contents
}

export async function getContentById(id: string): Promise<Content | null> {
  return contents.find((content) => content.id === id) || null
}

export async function createContent(data: Partial<Content>): Promise<Content> {
  const id = generateId()
  const now = new Date()

  const newContent: Content = {
    id,
    title: data.title!,
    description: data.description!,
    type: data.type!,
    posterUrl: data.posterUrl!,
    year: data.year!,
    rating: data.rating!,
    genres: data.genres || [],
    createdAt: now,
    updatedAt: now,
  }

  contents.push(newContent)
  return newContent
}

export async function updateContent(id: string, data: Partial<Content>): Promise<Content | null> {
  const index = contents.findIndex((content) => content.id === id)
  if (index === -1) return null

  contents[index] = { ...contents[index], ...data, updatedAt: new Date() }
  return contents[index]
}

export async function deleteContent(id: string): Promise<boolean> {
  const initialLength = contents.length
  const newContents = contents.filter((content) => content.id !== id)

  if (newContents.length === initialLength) {
    return false
  }

  contents.length = 0
  contents.push(...newContents)
  return true
}

// Watchlist functions
export async function getWatchlistByUserId(userId: string): Promise<Watchlist[]> {
  return watchlists.filter((watchlist) => watchlist.userId === userId)
}

export async function addToWatchlist(userId: string, contentId: string): Promise<Watchlist> {
  const id = generateId()
  const now = new Date()

  const newWatchlistItem: Watchlist = {
    id,
    userId,
    contentId,
    addedAt: now,
  }

  watchlists.push(newWatchlistItem)
  return newWatchlistItem
}

export async function removeFromWatchlist(userId: string, contentId: string): Promise<void> {
  watchlists = watchlists.filter((watchlist) => !(watchlist.userId === userId && watchlist.contentId === contentId))
}

// Authentication helpers
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return compare(plainPassword, hashedPassword)
}

// Statistics functions
export async function getContentStats(): Promise<{
  totalMovies: number
  totalSeries: number
  totalAnimations: number
  totalUsers: number
}> {
  const totalMovies = contents.filter((content) => content.type === ContentType.MOVIE).length
  const totalSeries = contents.filter((content) => content.type === ContentType.SERIES).length
  const totalAnimations = contents.filter((content) => content.type === ContentType.ANIMATION).length
  const totalUsers = users.length

  return {
    totalMovies,
    totalSeries,
    totalAnimations,
    totalUsers,
  }
}

// Initialize with some data
async function seedDatabase() {
  // Create admin user
  if (users.length === 0) {
    const adminPassword = await hashPassword("admin123")
    await createUser({
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    })

    const userPassword = await hashPassword("user123")
    await createUser({
      name: "Regular User",
      email: "user@example.com",
      password: userPassword,
      role: UserRole.USER,
      emailVerified: new Date(),
    })
  }

  // Create some content
  if (contents.length === 0) {
    // Add movies
    for (let i = 1; i <= 10; i++) {
      await createContent({
        title: `Movie Title ${i}`,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
        type: ContentType.MOVIE,
        posterUrl: `/placeholder.svg?height=450&width=300&text=Movie ${i}`,
        year: `${2020 + Math.floor(Math.random() * 5)}`,
        rating:
          "★".repeat(Math.floor(Math.random() * 2) + 3) +
          (Math.random() > 0.5 ? "½" : "") +
          "☆".repeat(5 - Math.floor(Math.random() * 2) - 3 - (Math.random() > 0.5 ? 1 : 0)),
        genres: ["Action", "Adventure", "Drama", "Comedy", "Thriller", "Sci-Fi"]
          .sort(() => 0.5 - Math.random())
          .slice(0, 2),
      })
    }

    // Add series
    for (let i = 1; i <= 5; i++) {
      const seriesId = generateId()
      const now = new Date()

      const newSeries: Series = {
        id: seriesId,
        title: `Series Title ${i}`,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
        type: ContentType.SERIES,
        posterUrl: `/placeholder.svg?height=450&width=300&text=Series ${i}`,
        year: `${2018 + Math.floor(Math.random() * 7)}`,
        rating:
          "★".repeat(Math.floor(Math.random() * 2) + 3) +
          (Math.random() > 0.5 ? "½" : "") +
          "☆".repeat(5 - Math.floor(Math.random() * 2) - 3 - (Math.random() > 0.5 ? 1 : 0)),
        genres: ["Drama", "Comedy", "Thriller", "Mystery", "Fantasy", "Horror"]
          .sort(() => 0.5 - Math.random())
          .slice(0, 2),
        createdAt: now,
        updatedAt: now,
        seasons: [],
      }

      // Add seasons and episodes
      const seasonCount = Math.floor(Math.random() * 3) + 1
      for (let j = 1; j <= seasonCount; j++) {
        const seasonId = generateId()

        const season: Season = {
          id: seasonId,
          seasonNumber: j,
          title: `Season ${j}`,
          posterUrl: `/placeholder.svg?height=450&width=300&text=Season ${j}`,
          contentId: seriesId,
          episodes: [],
        }

        // Add episodes
        const episodeCount = Math.floor(Math.random() * 6) + 5
        for (let k = 1; k <= episodeCount; k++) {
          const episode: Episode = {
            id: generateId(),
            episodeNumber: k,
            title: `Episode ${k}`,
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl.",
            duration: `${Math.floor(Math.random() * 30) + 20}m`,
            thumbnailUrl: `/placeholder.svg?height=180&width=320&text=S${j}E${k}`,
            seasonId: seasonId,
          }

          season.episodes.push(episode)
        }

        newSeries.seasons.push(season)
      }

      contents.push(newSeries)
    }

    // Add animations
    for (let i = 1; i <= 5; i++) {
      await createContent({
        title: `Animation Title ${i}`,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
        type: ContentType.ANIMATION,
        posterUrl: `/placeholder.svg?height=450&width=300&text=Animation ${i}`,
        year: `${2015 + Math.floor(Math.random() * 10)}`,
        rating:
          "★".repeat(Math.floor(Math.random() * 2) + 3) +
          (Math.random() > 0.5 ? "½" : "") +
          "☆".repeat(5 - Math.floor(Math.random() * 2) - 3 - (Math.random() > 0.5 ? 1 : 0)),
        genres: ["Animation", "Adventure", "Comedy", "Family", "Fantasy"].sort(() => 0.5 - Math.random()).slice(0, 2),
      })
    }
  }
}






// async function fetchMovies(page: number, sortBy: string, sortOrder: Sort) {
//   const itemsPerPage = DEFAULT_PAGE_SIZE;
//   const skip = (page - 1) * itemsPerPage;
//   const validSortBy = ["title"].includes(sortBy) ? sortBy : "title";
//   const [items, totalItems] = await Promise.all([
//     prisma.movie.findMany({
//       skip,
//       take: itemsPerPage,
//       orderBy: { [validSortBy]: sortOrder },
//       cacheStrategy: { ttl: 60 },
//     }),
//     prisma.movie.count(),
//   ]);
//   return { items, totalItems };
// }

// Seed the database
seedDatabase()