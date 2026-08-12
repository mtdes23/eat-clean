import { NextResponse } from "next/server";
const { prisma } = require("../../../../lib/prisma");

export async function GET() {
  const plans = await prisma.mealPlan.findMany({
    include: {
      days: {
        include: {
          meals: { include: { meal: true } },
        },
        orderBy: { dayIndex: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json(plans);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const plan = await prisma.mealPlan.create({
      data: {
        userId: body.userId || "default",
        weekStart: new Date(body.weekStart || Date.now()),
        label: body.label,
        days: {
          create: (body.days || []).map((day, i) => ({
            dayIndex: i,
            dayName: day.dayName,
            meals: {
              create: (day.meals || []).map((m) => ({
                mealId: m.mealId,
                type: m.type,
              })),
            },
          })),
        },
      },
      include: {
        days: {
          include: { meals: { include: { meal: true } } },
          orderBy: { dayIndex: "asc" },
        },
      },
    });
    return NextResponse.json(plan, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await prisma.mealPlan.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
