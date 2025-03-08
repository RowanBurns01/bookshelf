import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getFeaturedBooks() {
  const response = await fetch('/api/books?type=featured')
  if (!response.ok) {
    throw new Error('Failed to fetch featured books')
  }
  return response.json()
}

export async function getPopularBooks() {
  const response = await fetch('/api/books?type=popular')
  if (!response.ok) {
    throw new Error('Failed to fetch popular books')
  }
  return response.json()
}

export async function getNewReleases() {
  const response = await fetch('/api/books?type=new')
  if (!response.ok) {
    throw new Error('Failed to fetch new releases')
  }
  return response.json()
}

export async function getUserBooks(userId: string, status?: 'reading' | 'completed' | 'want-to-read') {
  const response = await fetch(`/api/users/${userId}/books${status ? `?status=${status}` : ''}`)
  if (!response.ok) {
    throw new Error('Failed to fetch user books')
  }
  return response.json()
}

export async function getUserLists(userId: string) {
  const response = await fetch(`/api/users/${userId}/lists`)
  if (!response.ok) {
    throw new Error('Failed to fetch user lists')
  }
  return response.json()
}

export async function getUserProfile(userId: string) {
  const response = await fetch(`/api/users/${userId}/profile`)
  if (!response.ok) {
    throw new Error('Failed to fetch user profile')
  }
  return response.json()
}

export async function getRecentActivity(userId: string) {
  const response = await fetch(`/api/users/${userId}/activity`)
  if (!response.ok) {
    throw new Error('Failed to fetch recent activity')
  }
  return response.json()
} 