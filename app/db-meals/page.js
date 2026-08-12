import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function MealsApiPage() {
  const meals = await prisma.meal.findMany({ orderBy: { type: "asc" } });

  const groups = {
    breakfast: meals.filter((m) => m.type === "breakfast"),
    lunch: meals.filter((m) => m.type === "lunch"),
    dinner: meals.filter((m) => m.type === "dinner"),
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-xl font-bold mb-4">Meals from Database ({meals.length})</h1>
      {Object.entries(groups).map(([type, items]) => (
        <div key={type} className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-400 mb-2">{type}</h2>
          <div className="space-y-1">
            {items.map((m) => (
              <div key={m.id} className="glass rounded-lg p-3 flex justify-between items-center">
                <span className="text-sm">{m.name}</span>
                <span className="text-xs text-zinc-500">{m.calories} kcal</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
