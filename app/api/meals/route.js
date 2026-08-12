import { NextResponse } from "next/server";
const { prisma } = require("../../../lib/prisma");

export async function GET() {
  const meals = await prisma.meal.findMany({ orderBy: { type: "asc" } });
  return NextResponse.json(meals);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const meal = await prisma.meal.create({
      data: {
        id: body.id,
        name: body.name,
        type: body.type,
        calories: body.calories,
        time: body.time,
        servings: body.servings,
        ingredients: JSON.stringify(body.ingredients || []),
        steps: JSON.stringify(body.steps || []),
      },
    });
    return NextResponse.json(meal, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
