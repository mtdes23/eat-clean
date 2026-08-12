import { NextResponse } from "next/server";
const { prisma } = require("../../../../lib/prisma");

export async function GET(req, { params }) {
  const meal = await prisma.meal.findUnique({ where: { id: params.id } });
  if (!meal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(meal);
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const meal = await prisma.meal.update({
      where: { id: params.id },
      data: {
        name: body.name,
        type: body.type,
        calories: body.calories,
        time: body.time,
        servings: body.servings,
        ingredients: body.ingredients ? JSON.stringify(body.ingredients) : undefined,
        steps: body.steps ? JSON.stringify(body.steps) : undefined,
      },
    });
    return NextResponse.json(meal);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await prisma.meal.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
