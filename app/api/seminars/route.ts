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

// GET handler to retrieve all seminars
export async function GET() {
  try {
    const data = getSeminarsData()
    return NextResponse.json(data.seminars)
  } catch (error) {
    console.error("Error in GET /api/seminars:", error)
    return NextResponse.json({ error: "Failed to fetch seminars" }, { status: 500 })
  }
}

// POST handler to create a new seminar
export async function POST(request: Request) {
  try {
    const newSeminar = await request.json()
    const data = getSeminarsData()

    // Generate a new ID
    const maxId = data.seminars.reduce((max: number, seminar: Seminar) => (seminar.id > max ? seminar.id : max), 0)

    newSeminar.id = maxId + 1
    data.seminars.push(newSeminar)

    writeSeminarsData(data)

    return NextResponse.json(newSeminar, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/seminars:", error)
    return NextResponse.json({ error: "Failed to create seminar" }, { status: 500 })
  }
}

