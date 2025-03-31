/**
 * API module for interacting with seminars data
 */

// Type definition for a seminar
export interface Seminar {
  id: number
  title: string
  description: string
  date: string
  time: string
  photo: string
}

/**
 * Fetches all seminars
 */
export async function fetchSeminars(): Promise<Seminar[]> {
  try {
    const response = await fetch("/api/seminars", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Error fetching seminars: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch seminars:", error)
    throw error
  }
}

/**
 * Deletes a seminar by ID
 */
export async function deleteSeminar(id: number): Promise<void> {
  try {
    const response = await fetch(`/api/seminars/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Error deleting seminar: ${response.status}`)
    }
  } catch (error) {
    console.error(`Failed to delete seminar with ID ${id}:`, error)
    throw error
  }
}

/**
 * Updates a seminar
 */
export async function updateSeminar(seminar: Seminar): Promise<Seminar> {
  try {
    const response = await fetch(`/api/seminars/${seminar.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(seminar),
    })

    if (!response.ok) {
      throw new Error(`Error updating seminar: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to update seminar with ID ${seminar.id}:`, error)
    throw error
  }
}

