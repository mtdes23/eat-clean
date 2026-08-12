"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Flame, Clock, Users, Check } from "lucide-react";

const recipes = {
  b1: { ingredients: ['40g yen mach can det', '100ml sua tuoi/sua hat khong duong', '1 muong hat chia', 'Trai cay tuy thich', '1/2 muong mat ong (tuy chon)'], steps: ['Cho yen mach va hat chia vao hu thuy tinh sach.', 'Do sua tuoi vao hu sao cho ngap yen mach.', 'Them mat ong neu thich, khuay deu.', 'Day nap kin, cho vao ngan mat tu lanh qua dem.', 'Sang hom sau, them trai cay len tren va thuong thuc.'] },
  b2: { ingredients: ['2 lat banh mi den nguyen cam', '2 qua trung ga', '1/2 qua bo', 'Rau xa lach, ca chua bi', 'Muoi hong, tieu chanh'], steps: ['Banh mi nuong vang gion.', 'Trung op la voi dau oliu, long dao vua chin toi.', 'Bo nghien phet len banh mi.', 'Xep trung, xa lach, ca chua bi len tren.'] },
  b3: { ingredients: ['1 nam rau bina', '1/2 qua bo', '1 qua chuoi chin', '200ml sua hat khong duong', '1 muong hat chia'], steps: ['Rau bina rua sach, bo va chuoi cat nho.', 'Cho tat ca vao may xay sinh to.', 'Xay nhuy den khi min.', 'Rac hat chia len tren va thuong thuc.'] },
  b4: { ingredients: ['1 hu sua chua khong duong (150g)', '1/2 qua tao xanh', '1/2 qua chuoi', 'Vai qua dau tay', '1 muong granola (tuy chon)'], steps: ['Trai cay rua sach, cat hat leu nho.', 'Cho sua chua ra bat, xep trai cay len tren.', 'Rac granola va thuong thuc.'] },
  b5: { ingredients: ['1 cu khoai lang vua (200g)', '1 muong bo dau phong khong duong', '1/2 muong mat ong (tuy chon)'], steps: ['Khoai lang rua sach, luoc 20 phut.', 'De nguoi bot, lot vo va cat khoanh.', 'Phet bo dau phong, ruou mat ong.', 'Dung kem tra xanh am.'] },
  b6: { ingredients: ['2 qua trung ga', '1 qua tao xanh', 'Muoi hong, tieu chanh'], steps: ['Trung luoc chin long dao 7-8 phut.', 'Tao xanh cat lat.', 'Boc vo trung, cat doi, rac muoi hong tieu chanh.'] },
  b7: { ingredients: ['1 qua chuoi chin', '1 qua trung ga', '30g yen mach', 'Bot no (baking powder)', 'Dau dua (de ran)'], steps: ['Chuoi nghien nhuyen bang nia.', 'Cho trung, yen mach, bot no vao, tron deo.', 'Ran moi mat 2-3 phut tren lua nho.', 'Xep ra dia, them chuoi lat hoac mat ong.'] },
  b8: { ingredients: ['100g bun lut kho', '50g uc ga luoc xe soi', 'Rau thom, xa lach, gia do', 'Nuoc mam diet', 'Toi bam, ot, chanh'], steps: ['Bun lut ngam nuoc lanh 15 phut, trung qua nuoc soi.', 'Uc ga luoc, xe nho the tho.', 'Pha nuoc so: nuoc mam diet + toi + ot + chanh.', 'Tron bun voi rau va uc ga, ruou nuoc so.', 'Them lac rang gi nho.'] },
  b9: { ingredients: ['1 qua chuoi dong lanh', '1/2 qua xoai chin', '100ml sua hat khong duong', '2 muong granola', 'Dau tay, viet quat'], steps: ['Chuoi va xoai cat nho cho vao may xay.', 'Them sua hat, xay nhuy dac set.', 'Do ra bat, xep granola va trai cay len mat.'] },
  l1: { ingredients: ['100g uc ga tuoi', 'Com ga lut (chin)', '1/2 sup lo xanh', 'Dau oliu', 'Tieu chanh, hat nem diet, xi dau'], steps: ['Uc ga uop hat nem diet va tieu chanh 15 phut.', 'Sup lo xanh luoc chin toi.', 'Ap chao uc ga moi mat 3-4 phut.', 'Thai lat, bay ra dia com va sup lo.'] },
  l2: { ingredients: ['1 lon ca ngua', 'Xoai xanh bao soi', 'Xa lach, ca chua bi, dua leo', 'Dau oliu, nuoc cot chanh day', 'Hat dieu rang'], steps: ['Rau cu rua sach, ca chua bi cat doi.', 'Pha nuoc so: dau oliu + chanh day + muoi.', 'Tron ca ngua va xoai voi rau cu.', 'Rac hat dieu gi nho len tren.'] },
  l3: { ingredients: ['100g bun lut kho', '80g thit bo nac thai mong', '1 bo cai thia', 'Dau oliu', 'Xi dau diet, dau hao, toi bam'], steps: ['Bun lut luoc, xa qua nuoc lanh.', 'Thit bo uop xi dau va toi.', 'Xao thit bo chinh toi, trut ra.', 'Xao cai thia, cho bun va thit vao dao deo.'] },
  l4: { ingredients: ['120g ca hoi phi le', 'Com ga lut (chin)', '5-6 cay mang tay', 'Dau oliu', 'Muoi bien, tieu chanh, nuoc cot chanh'], steps: ['Ca hoi uop muoi tieu chanh 10 phut.', 'Mang tay luoc so 2 phut.', 'Ap chao ca hoi moi mat 3-4 phut.', 'Vat nuoc cot chanh, bay ra dia.'] },
  l5: { ingredients: ['100g mi ga lut', '1 qua ca chua bam', '50g thit nic bam', 'Dau oliu', 'Toi, hanh tim, oregano, muoi'], steps: ['Mi luoc al deo, giu lai it nuoc luoc.', 'Xao thit bam chinh toi.', 'Them ca chua, oregano, dun nho lua 10 phut.', 'Cho mi vao so deo, them nuoc luoc neu kho.'] },
  l6: { ingredients: ['100g nui lut', '80g ca hoi', 'Sot Pesto xanh', 'Ca chua bi', 'Parmesan bao (tuy chon)'], steps: ['Nui lut luoc chin, xas ra.', 'Ca hoi ap chao, de nguoi va xe nho.', 'Cat doi ca chua bi.', 'Tron nui voi Pesto, them ca hoi va ca chua bi.'] },
  l7: { ingredients: ['100g uc ga', 'Xa lach, ca chua bi, dua leo', 'Dau oliu', 'Me rang, giam gao, xi dau', 'Mat ong'], steps: ['Uc ga ap chao vang 2 mat.', 'Pha so me rang: me + giam + xi dau + dau oliu + mat ong.', 'Thai uc ga lat, xep len rau, ruou so me rang.'] },
  l8: { ingredients: ['Com quinoa (chin)', '100g dau hu non', '50g nam huong', 'Dau oliu', 'Xi dau diet, toi, hanh la'], steps: ['Dau hu cat mieng vuong, chien vang nhe.', 'Xao nam chinh toi.', 'Pha xot: xi dau + nuoc loc + hanh la, dun nho.', 'Cho dau hu vao nam, dun 2 phut, bay len quinoa.'] },
  l9: { ingredients: ['4-5 banh trang lut', '100g tom luoc', '50g thit heo luoc thai soi', 'Bun lut, rau thom', 'Nuoc mam diet, chanh, toi, ot'], steps: ['Tom va thit luoc, de nguoi.', 'Trung bun qua nuoc soi.', 'Nhung banh trang qua nuoc am, xep rau, bun, tom, thit, cuon chat.', 'Pha nuoc cham diet.'] },
  l10: { ingredients: ['80g thit heo nic', 'Com ga lut (chin)', '100g gia do, he', 'Dau oliu', 'Xi dau diet, hat nem, toi'], steps: ['Thit heo uop 10 phut.', 'Xao thit chinh toi, trut ra.', 'Xao gia he lua lon 1-2 phut, cho thit vao dao deo.', 'Don kem com ga lut.'] },
  d1: { ingredients: ['80g uc ga luoc xe phay', '1/2 banh ngo ngot', 'Xa lach, ca chua bi', 'Dau oliu, nuoc cot chanh, muoi hong'], steps: ['Rua sach rau, cat vua an.', 'Pha nuoc xot: dau oliu + chanh + muoi.', 'Tron uc ga voi rau va ngo ngot.', 'Ruou nuoc xot len tren.'] },
  d2: { ingredients: ['100g thit bo nac', 'Xa lach, ca chua bi, dua leo', 'Dau oliu', 'Giam gao, muoi hong, tieu chanh'], steps: ['Thit bo uop muoi tieu 10 phut.', 'Pha giam salad: dau oliu + giam gao + muoi hong.', 'Ap chao thit bo moi mat 1.5-2 phut.', 'Thai lat, xep len rau, ruou giam.'] },
  d3: { ingredients: ['100g tom tuoi', 'Bi do thai leu', '30g thit nic bam', 'Dau oliu', 'Hanh tim, muoi, tieu'], steps: ['Tom huong 5-7 phut, de rieng.', 'Xao thit bam san.', 'Them bi do va nuoc, dun soi cho bi mem.', 'Nem muoi tieu, tat bep, don kem canh.'] },
  d4: { ingredients: ['100g uc ga dan mong', 'Ca rot, dua leo, ot chuong', 'Dau oliu', 'Muoi tieu, xi dau diet'], steps: ['Uc ga uop 10 phut.', 'Xep rau cu len dau uc ga.', 'Cuon chat, dung tam co dinh.', 'Hap hoac ap chao 10-12 phut, cat khoanh.'] },
  d5: { ingredients: ['100g ca loc', 'Sup lo xanh', 'Hanh la, gung', 'Dau oliu', 'Nuoc mam diet, tieu chanh'], steps: ['Ca loc uop gung hanh nuoc mam.', 'Hap 12-15 phut.', 'Sup lo xanh luoc 3-4 phut.', 'Bay ra dia, rac tieu chanh.'] },
  d6: { ingredients: ['1 dua leo', '2 ca chua', '2 trung luoc', 'Dau oliu', 'Giam tao, muoi hong, tieu'], steps: ['Dua leo thai lat, ca chua cat muoi cau.', 'Trung boc vo, cat lat.', 'Pha dau giam: dau oliu + giam tao + muoi hong + tieu.', 'Ruou len salad.'] },
  d7: { ingredients: ['100g dau hu non', '2 ca chua bam', '50g nam kim cham', 'Hanh la, toi', 'Dau oliu, nuoc mam diet, tieu'], steps: ['Dau hu chien vang nhe.', 'Xao toi, ca chua nhu.', 'Them nuoc, nam, dun soi, nem nuoc mam.', 'Cho dau hu vao, dun 3 phut, rac hanh la tieu.'] },
  d8: { ingredients: ['20g rong bien kho', '50g thit bam', '50g dau hu non', 'Hanh tim', 'Nuoc mam diet, muoi, tieu'], steps: ['Rong bien ngam 10 phut, rua sach.', 'Xao thit bam san.', 'Dun nuoc soi, tha dau hu va rong bien vao.', 'Nem nuoc mam, dun 5 phut, rac tieu.'] },
  d9: { ingredients: ['Banh ngo ngot luoc', '60g thit nic bam', '50g nam moc nhi', 'Hanh la, toi', 'Dau oliu, nuoc mam diet, tieu'], steps: ['Xao thit bam san.', 'Them nam xao chung 3 phut.', 'Nem nuoc mam, trut ra dia.', 'Dung kem bap ngot.'] },
};

const allMeals = [
  { id: 'b1', name: 'Yen mach ngam sua hat', calories: 300, type: 'breakfast' },
  { id: 'b2', name: 'Banh mi den & Trung op la', calories: 280, type: 'breakfast' },
  { id: 'b3', name: 'Sinh to xanh', calories: 250, type: 'breakfast' },
  { id: 'b4', name: 'Sua chua & Trai cay tuoi', calories: 200, type: 'breakfast' },
  { id: 'b5', name: 'Khoai lang luoc & Bo dau phong', calories: 260, type: 'breakfast' },
  { id: 'b6', name: 'Trung luoc & Tao xanh', calories: 150, type: 'breakfast' },
  { id: 'b7', name: 'Pancake yen mach chuoi', calories: 320, type: 'breakfast' },
  { id: 'b8', name: 'Bun lut tron uc ga xe', calories: 350, type: 'breakfast' },
  { id: 'b9', name: 'Smoothie bowl ngu coc', calories: 280, type: 'breakfast' },
  { id: 'l1', name: 'Com ga lut & Uc ga nuong', calories: 450, type: 'lunch' },
  { id: 'l2', name: 'Salad ca ngua', calories: 380, type: 'lunch' },
  { id: 'l3', name: 'Bun lut xao thit bo', calories: 420, type: 'lunch' },
  { id: 'l4', name: 'Com lut & Ca hoi ap chao', calories: 500, type: 'lunch' },
  { id: 'l5', name: 'Mi rau cu xot ca chua', calories: 400, type: 'lunch' },
  { id: 'l6', name: 'Nui lut luon ca hoi Pesto', calories: 460, type: 'lunch' },
  { id: 'l7', name: 'Salad uc ga sot me rang', calories: 350, type: 'lunch' },
  { id: 'l8', name: 'Com quinoa & Dau hu xot nam', calories: 380, type: 'lunch' },
  { id: 'l9', name: 'Cuon tom thit luoc', calories: 320, type: 'lunch' },
  { id: 'l10', name: 'Com lut & Thit heo xao gia', calories: 430, type: 'lunch' },
  { id: 'd1', name: 'Salad uc ga & Banh ngot', calories: 280, type: 'dinner' },
  { id: 'd2', name: 'Bo ne nic ap chao', calories: 350, type: 'dinner' },
  { id: 'd3', name: 'Tom huong & Canh bi do', calories: 300, type: 'dinner' },
  { id: 'd4', name: 'Uc ga cuon rau cu', calories: 250, type: 'dinner' },
  { id: 'd5', name: 'Sup lo xanh & Ca loc huong', calories: 280, type: 'dinner' },
  { id: 'd6', name: 'Salad dua leo & Trung luoc', calories: 200, type: 'dinner' },
  { id: 'd7', name: 'Dau hu non sot ca chua', calories: 220, type: 'dinner' },
  { id: 'd8', name: 'Canh rong bien dau non', calories: 150, type: 'dinner' },
  { id: 'd9', name: 'Bap luoc & Thit bam xao nam', calories: 300, type: 'dinner' },
];

const typeInfo = {
  breakfast: { color: '#f59e0b', label: 'BUA SANG', icon: '🌅' },
  lunch: { color: '#10b981', label: 'BUA TRUA', icon: '☀️' },
  dinner: { color: '#8b5cf6', label: 'BUA TOI', icon: '🌙' },
};

export default function RecipeDetail({ params }) {
  const router = useRouter();
  const [checkedIng, setCheckedIng] = useState([]);
  const [checkedStep, setCheckedStep] = useState([]);

  const meal = allMeals.find((m) => m.id === params.id);
  const recipe = recipes[params.id] || { ingredients: [], steps: [] };
  const info = typeInfo[meal?.type] || typeInfo.breakfast;

  const toggleIng = (i) =>
    setCheckedIng((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  const toggleStep = (i) =>
    setCheckedStep((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Khong tim thay mon an
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="sticky top-0 z-40"
        style={{ background: "linear-gradient(180deg, #000 60%, transparent)" }}
      >
        <div className="flex items-center gap-3 px-4 pb-2 pt-3">
          <button
            onClick={() => router.back()}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-zinc-400 active:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold tracking-tight truncate">{meal.name}</h1>
        </div>
      </header>

      <main className="flex-1 px-4 pb-8">
        <div className="glass rounded-2xl p-4 mb-4 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold"
            style={{ background: info.color + "22", color: info.color }}
          >
            {info.icon}
          </div>
          <div className="flex gap-4 flex-1 flex-wrap">
            <div>
              <span className="text-[9px] text-zinc-500 font-medium uppercase tracking-widest">
                {info.label}
              </span>
              <p className="text-sm font-semibold mt-0.5" style={{ color: info.color }}>
                <Flame className="w-3.5 h-3.5 inline -mt-0.5" /> {meal.calories} kcal
              </p>
            </div>
          </div>
        </div>

        <section className="mb-6">
          <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: info.color }}>
            Nguyen lieu
          </h2>
          <div className="glass rounded-2xl p-4 space-y-1">
            {recipe.ingredients.map((ing, i) => (
              <div
                key={i}
                onClick={() => toggleIng(i)}
                className="flex items-center gap-3 px-2 py-1.5 rounded-xl cursor-pointer transition-all hover:bg-white/5 active:scale-[0.99]"
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                    checkedIng.includes(i)
                      ? "border-white/80 bg-white/20"
                      : "border-zinc-600"
                  }`}
                >
                  {checkedIng.includes(i) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span
                  className={`text-sm transition-all duration-200 ${
                    checkedIng.includes(i) ? "text-zinc-500 line-through" : "text-white/90"
                  }`}
                >
                  {ing}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: info.color }}>
            Cach lam
          </h2>
          <div className="glass rounded-2xl p-4 space-y-3">
            {recipe.steps.map((step, i) => (
              <div
                key={i}
                onClick={() => toggleStep(i)}
                className="flex gap-3 px-2 py-2 rounded-xl cursor-pointer transition-all hover:bg-white/5 active:scale-[0.99]"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-all duration-200 ${
                    checkedStep.includes(i) ? "bg-white/20 text-white/60" : "text-white"
                  }`}
                  style={
                    checkedStep.includes(i)
                      ? {}
                      : { background: info.color + "33", color: info.color }
                  }
                >
                  {checkedStep.includes(i) ? "✓" : i + 1}
                </div>
                <p
                  className={`text-sm transition-all duration-200 ${
                    checkedStep.includes(i)
                      ? "text-zinc-500 line-through"
                      : "text-white/85 leading-relaxed"
                  }`}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
