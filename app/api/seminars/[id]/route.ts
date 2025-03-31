import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Define the seminar type
export interface Seminar {
  id: number
  title: string
  description: string
  date: string
  time: string
  photo: string
}

// Path to the seminars.json file
const dataFilePath = path.join(process.cwd(), "public", "seminars.json")

// Helper function to read the seminars data
function getSeminarsData() {
  try {
    const fileData = fs.readFileSync(dataFilePath, "utf8")
    return JSON.parse(fileData)
  } catch (error) {
    console.error("Error reading seminars data:", error)
    return { seminars: [] }
  }
}

// Helper function to write the seminars data
function writeSeminarsData(data: { seminars: Seminar[] }) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8")
    return true
  } catch (error) {
    console.error("Error writing seminars data:", error)
    return false
  }
}

// GET handler to retrieve a specific seminar
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = getSeminarsData()
    const seminar = data.seminars.find((s: Seminar) => s.id === id)

    if (!seminar) {
      return NextResponse.json({ error: "Seminar not found" }, { status: 404 })
    }

    return NextResponse.json(seminar)
  } catch (error) {
    console.error(`Error in GET /api/seminars/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch seminar" }, { status: 500 })
  }
}

// PUT handler to update a specific seminar
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const updatedSeminar = await request.json()
    const data = getSeminarsData()

    const index = data.seminars.findIndex((s: Seminar) => s.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Seminar not found" }, { status: 404 })
    }

    // Ensure the ID doesn't change
    updatedSeminar.id = id
    data.seminars[index] = updatedSeminar

    writeSeminarsData(data)

    return NextResponse.json(updatedSeminar)
  } catch (error) {
    console.error(`Error in PUT /api/seminars/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update seminar" }, { status: 500 })
  }
}

// DELETE handler to remove a specific seminar
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = getSeminarsData()

    const index = data.seminars.findIndex((s: Seminar) => s.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Seminar not found" }, { status: 404 })
    }

    data.seminars.splice(index, 1)

    writeSeminarsData(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error in DELETE /api/seminars/${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete seminar" }, { status: 500 })
  }
}

