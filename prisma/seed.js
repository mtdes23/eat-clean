const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const mealsData = [
  { id: 'b1', name: 'Yen mach ngam sua hat (Overnight Oats)', type: 'breakfast', calories: 300, time: '5 phut + qua dem', servings: '1 phan' },
  { id: 'b2', name: 'Banh mi den & Trung op la', type: 'breakfast', calories: 280, time: '15 phut', servings: '1 phan' },
  { id: 'b3', name: 'Sinh to xanh (Rau bina, bo, chuoi)', type: 'breakfast', calories: 250, time: '5 phut', servings: '1 phan' },
  { id: 'b4', name: 'Sua chua khong duong & Trai cay tuoi', type: 'breakfast', calories: 200, time: '5 phut', servings: '1 phan' },
  { id: 'b5', name: 'Khoai lang luoc & Bo dau phong', type: 'breakfast', calories: 260, time: '25 phut', servings: '1 phan' },
  { id: 'b6', name: 'Trung luoc & Tao xanh', type: 'breakfast', calories: 150, time: '10 phut', servings: '1 phan' },
  { id: 'b7', name: 'Pancake yen mach chuoi', type: 'breakfast', calories: 320, time: '15 phut', servings: '1 phan' },
  { id: 'b8', name: 'Bun lut tron uc ga xe', type: 'breakfast', calories: 350, time: '20 phut', servings: '1 phan' },
  { id: 'b9', name: 'Smoothie bowl ngu coc trai cay', type: 'breakfast', calories: 280, time: '10 phut', servings: '1 phan' },
  { id: 'l1', name: 'Com ga lut & Uc ga nuong tieu', type: 'lunch', calories: 450, time: '30 phut', servings: '1 phan' },
  { id: 'l2', name: 'Salad ca ngua ngam nuoc saot chanh day', type: 'lunch', calories: 380, time: '15 phut', servings: '1 phan' },
  { id: 'l3', name: 'Bun lut xao thit bo nac & cai thia', type: 'lunch', calories: 420, time: '25 phut', servings: '1 phan' },
  { id: 'l4', name: 'Com lut & Ca hoi ap chao mang tay', type: 'lunch', calories: 500, time: '25 phut', servings: '1 phan' },
  { id: 'l5', name: 'Mi rau cu xot ca chua thit nic bam', type: 'lunch', calories: 400, time: '30 phut', servings: '1 phan' },
  { id: 'l6', name: 'Nui lut luon ca hoi xot Pesto', type: 'lunch', calories: 460, time: '25 phut', servings: '1 phan' },
  { id: 'l7', name: 'Salad uc ga ap chao sot me rang', type: 'lunch', calories: 350, time: '20 phut', servings: '1 phan' },
  { id: 'l8', name: 'Com quinoa & Dau hu xot nam', type: 'lunch', calories: 380, time: '25 phut', servings: '1 phan' },
  { id: 'l9', name: 'Cuon tom thit luoc & banh trang lut', type: 'lunch', calories: 320, time: '20 phut', servings: '1 phan' },
  { id: 'l10', name: 'Com lut & Thit heo nic xao gia he', type: 'lunch', calories: 430, time: '25 phut', servings: '1 phan' },
  { id: 'd1', name: 'Salad uc ga xe phay & banh ngot', type: 'dinner', calories: 280, time: '15 phut', servings: '1 phan' },
  { id: 'd2', name: 'Bo ne nic ap chao kem salad giam', type: 'dinner', calories: 350, time: '20 phut', servings: '1 phan' },
  { id: 'd3', name: 'Tom huong & Canh bi do thit bam', type: 'dinner', calories: 300, time: '25 phut', servings: '1 phan' },
  { id: 'd4', name: 'Uc ga cuon rau cu huong', type: 'dinner', calories: 250, time: '20 phut', servings: '1 phan' },
  { id: 'd5', name: 'Sup lo xanh luoc & Ca loc huong hanh', type: 'dinner', calories: 280, time: '25 phut', servings: '1 phan' },
  { id: 'd6', name: 'Salad dua leo ca chua & Trung luoc', type: 'dinner', calories: 200, time: '10 phut', servings: '1 phan' },
  { id: 'd7', name: 'Dau hu non sot ca chua & Nam kim cham', type: 'dinner', calories: 220, time: '20 phut', servings: '1 phan' },
  { id: 'd8', name: 'Canh rong bien dau non & thit bam nac', type: 'dinner', calories: 150, time: '20 phut', servings: '1 phan' },
  { id: 'd9', name: 'Bap bap luoc & Thit bam xao nam moc nhi', type: 'dinner', calories: 300, time: '20 phut', servings: '1 phan' },
];

const recipesData = {
  b1: {
    ingredients: JSON.stringify(['40g yen mach can det', '100ml sua tuoi/sua hat khong duong', '1 muong hat chia', 'Trai cay tuy thich (chuoi, dau tay, viet quat)', '1/2 muong mat ong (tuy chon)']),
    steps: JSON.stringify(['Cho yen mach va hat chia vao mot chiec hu thuy tinh sach.', 'Do sua tuoi hoac vao hu sao cho ngap phan yen mach.', 'Them mot chut mat ong neu thich an ngot, sau do khuay deu.', 'Day nap kin, cho vao ngan mat tu lanh ngam qua dem (it nhat 4 tieng)', 'Sang hom sau, lay ra them trai cat cat nho len tren va thuong thuc.']),
  },
  b2: {
    ingredients: JSON.stringify(['2 lat banh mi den nguyen cam', '2 qua trung ga', '1/2 qua bo', 'Rau xa lach, ca chua bi', 'Muoi hong, tieu chanh']),
    steps: JSON.stringify(['Banh mi nuong vang gion tren chao chong dinh hoac may nuong banh mi.', 'Trung op la voi chut dau oliu, long dao vua chin toi.', 'Bo nghien nhuyen, phet len banh mi nuong.', 'Xep trung op la, xa lach va ca chua bi len tren, rac chut muoi hong tieu chanh.']),
  },
  b3: {
    ingredients: JSON.stringify(['1 nam rau bina (cai bo xoi)', '1/2 qua bo', '1 qua chuoi chin', '200ml sua hat khong duong', '1 muong hat chia']),
    steps: JSON.stringify(['Rau bina rua sach, de ra. Bo va chuoi cat nho.', 'Cho tat ca nguyen lieu vao may xay sinh to.', 'Xay nhuyden khi min, rot ra coc.', 'Rac hat chia len tren va thuong thuc ngay.']),
  },
  b4: {
    ingredients: JSON.stringify(['1 hu sua chua khong duong (150g)', '1/2 qua tao xanh', '1/2 qua chuoi', 'Vai qua dau tay hoac viet quat', '1 muong hat granola (tuy chon)']),
    steps: JSON.stringify(['Trai cay rua sach, cat hat leu nho.', 'Cho sua chua ra bat, xep trai cay len tren.', 'Rac granola va thuong thuc. Mon nay lam sieu nhanh, chi 5 phut la xong!']),
  },
  b5: {
    ingredients: JSON.stringify(['1 cu khoai lang vua (khoang 200g)', '1 muong bo dau phong khong duong', '1/2 muong mat ong (tuy chon)']),
    steps: JSON.stringify(['Khoai lang rua sach, luoc hoac hap chin mem (khoang 20 phut).', 'De khoai nguoi bot, lot vo va cat khoanh.', 'Phet bo dau phong len tung mieng khoai, ruou mat ong.', 'Dung kem voi mot ly tra xanh am thi chuan bai!']),
  },
  b6: {
    ingredients: JSON.stringify(['2 qua trung ga', '1 qua tao xanh', '1/2 muong muoi hong', 'Mot chut tieu chanh']),
    steps: JSON.stringify(['Trung luoc chin long dao (7-8 phut ke tu khi nuoc soi).', 'Tao xanh rua sach, cat lat hoac cat muoi cau.', 'Boc vo trung, cat doi va rac muoi hong tieu chanh.', 'Bay trung va tao ra dia. Buoi sang thanh dam ma giau nang luong!']),
  },
  b7: {
    ingredients: JSON.stringify(['1 qua chuoi chin', '1 qua trung ga', '30g yen mach can det', '1/2 muong bot no (baking powder)', '1 muong dau dua (de ran)']),
    steps: JSON.stringify(['Chuoi nghien nhuyen bang nia trong bat lon.', 'Cho trung, yen mach va bot no vao, tron deo den khi hop chat min.', 'Lam nong chao chong dinh voi dau dua o lua nho.', 'Muc tung muong bot do len chao, ran moi mat 2-3 phut den khi vang.', 'Xep pancake ra dia, them chuoi lat hoac mat ong len tren.']),
  },
  b8: {
    ingredients: JSON.stringify(['100g bun lut kho', '50g uc ga luoc xe soi', 'Rau thom, xa lach, gia do', '1 muong nuoc mam diet', '1/2 muong toi bam, ot tuoi, chanh']),
    steps: JSON.stringify(['Bun lut ngam nuoc lanh 15 phut, trung qua nuoc soi roi de ra.', 'Uc ga luoc chin, xe nho the tho.', 'Pha nuoc so: nuoc mam diet + toi bam + ot + nuoc cot chanh.', 'Tron bun voi rau cu va uc ga, ruou nuoc so deu tay.', 'Bay ra dia, them lac rang gi nho. Buoi sang kieu Viet!']),
  },
  b9: {
    ingredients: JSON.stringify(['1 qua chuoi dong lanh', '1/2 qua xoai chin', '100ml sua hat khong duong', '2 muong ngu coc granola', 'Dau tay, viet quat topping']),
    steps: JSON.stringify(['Chuoi dong lanh va xoai cat nho cho vao may xay.', 'Them sua hat, xay nhuyden khi hon hop dac set (smoothie bowl dac hon sinh to).', 'Do ra bat, xep granola va trai cay tuoi len mat.', 'Thuong thuc ngay khi con lanh.']),
  },
  l1: {
    ingredients: JSON.stringify(['100g uc ga tuoi', '1 bat com ga lut (chin)', '1/2 cay sup lo xanh', '1 muong ca phe dau oliu', 'Tieu chanh, hat nem diet, xi dau']),
    steps: JSON.stringify(['Uc ga rua sach, khia deu de tham gia vi. Uop voi hat nem diet va tieu chanh trong 15 phut.', 'Sup lo xanh cat mieng vua an, luoc chin toi.', 'Lam nong chao, cho chut dau oliu, ap chao uc ga moi mat 3-4 phut den khi chin vang.', 'Thai uc ga thanh lat. Bay ra dia com ga lut va sup lo.']),
  },
  l2: {
    ingredients: JSON.stringify(['1 lon ca ngua ngam dau/nuoc muoi (vat ra)', '1/2 qua xoai xanh bao soi', 'Rau xa lach, ca chua bi, dua leo', '1 muong dau oliu, 1 muong nuoc cot chanh day', 'Hat dieu rang (rac topping)']),
    steps: JSON.stringify(['Rau cu rua sach, xa lach xe nho, ca chua bi cat doi, dua leo thai lat.', 'Pha nuoc sao: dau oliu + nuoc cot chanh day + chut muoi.', 'Cho rau cu, ca ngua va xoai bao vao bat lon.', 'Ruou nuoc so tron deo, rac hat dieu gi nho len tren.']),
  },
  l3: {
    ingredients: JSON.stringify(['100g bun lut kho', '80g thit bo nac thai mong', '1 bo cai thia', '1 muong dau oliu', '1 muong xi dau diet, 1/2 muong dau hao, toi bam']),
    steps: JSON.stringify(['Bun lut luoc chin, xa qua nuoc lanh va de ra.', 'Cai thia rua sach, cat khuc. Thit bo uop voi xi dau va toi.', 'Phi thom toi bam voi dau oliu, xao thit bo chin toi, trut ra dia.', 'Xao cai thia voi chut dau hao, cho bun va thit bo vao dao deo.', 'Nem nem vua an, bay ra dia.']),
  },
  l4: {
    ingredients: JSON.stringify(['1 mieng ca hoi phi le (khoang 120g)', '1 bat com ga lut (chin)', '5-6 cay mang tay', '1 muong dau oliu', 'Muoi bien, tieu chanh, nuoc cot chanh']),
    steps: JSON.stringify(['Ca hoi rua sach, tham kho, uop muoi tieu chanh 10 phut.', 'Mang tay cat goc gia, luoc so qua nuoc soi 2 phut.', 'Lam nong chao voi dau oliu, ap chao ca hoi mat da xuong truoc, moi mat 3-4 phut.', 'Vat chut nuoc cot chanh len ca, bay ra dia com ga lut va mang tay.']),
  },
  l5: {
    ingredients: JSON.stringify(['100g mi ga lut (hoac mi y nguyen cam)', '1 qua ca chua chin bam nho', '50g thit nic bam', '1 muong dau oliu', '1 tep toi, hanh tim, la oregano (hung tay), muoi']),
    steps: JSON.stringify(['Mi luoc chin al deo, de giu lai it nuoc luoc.', 'Phi thom toi hanh voi dau oliu, cho thit bam vao xao chin.', 'Them ca chua bam, la oregano, nem muoi, dun nho lua 10 phut.', 'Cho mi vao so dao deo, them chut nuoc luoc mi neu kho.', 'Bay ra dia, rac tieu chanh len tren.']),
  },
  l6: {
    ingredients: JSON.stringify(['100g nui lut', '1 mieng ca hoi (80g)', '1 muong so Pesto xanh (hung que + hat thong + dau oliu)', 'Vai qua ca chua bi', 'Pho mai Parmesan bao (tuy chon)']),
    steps: JSON.stringify(['Nui lut luoc chin theo huong dan tren bao bi, xas ra.', 'Ca hoi ap chao voi chut dau oliu, de nguoi va xe nho.', 'Ca chua bi cat doi.', 'Tron nui voi so Pesto, them ca hoi va ca chua bi.', 'Rac Parmesan neu dung.']),
  },
  l7: {
    ingredients: JSON.stringify(['100g uc ga', 'Xa lach, ca chua bi, dua leo, bap cai tim', '1 muong dau oliu', '1 muong me rang, 1 muong giam gao, 1/2 muong xi dau', '1/2 muong mat ong']),
    steps: JSON.stringify(['Uc ga uop muoi tieu, ap chao voi dau oliu chinh vang 2 mat.', 'Pha so me rang: me rang + giam gao + xi dau + dau oliu + mat ong, khuay deo.', 'Rau cu thai nho, bay ra dia.', 'Thai uc ga thanh lat mong, xep len rau, ruou so me rang.']),
  },
  l8: {
    ingredients: JSON.stringify(['1 bat com quinoa (chin)', '1 mieng dau hu non (100g)', '50g nam huong hoac nam dui ga', '1 muong dau oliu', '2 muong xi dau diet, 1 tep toi, hanh la']),
    steps: JSON.stringify(['Dau hu cat mieng vuong nho, chien vang nhe voi dau oliu.', 'Nam rua sach, thai lat. Phi thom toi, xao nam chin.', 'Pha nuoc xot: xi dau + chut nuoc loc + hanh la, dun soi nhe.', 'Cho dau hu vao nam, ruou xot len, dun 2 phut.', 'Bay quinoa ra dia, xuc dau hu so nam len tren.']),
  },
  l9: {
    ingredients: JSON.stringify(['4-5 mieng banh trang lut', '100g tom luoc boc vo', '50g thit heo luoc thai soi', 'Bun lut, xa lach, rau thom, gia do', 'Nuoc mam diet, chanh, toi, ot']),
    steps: JSON.stringify(['Tom va thit heo luoc chin, de nguoi.', 'Rau cu rua sach, bun lut trung so nuoc soi.', 'Nhung banh trang qua nuoc am de mem, tra ra dia.', 'Xep lan luot xa lach, bun, rau thom, tom, thit len banh trang roi cuon chat.', 'Pha nuoc cham diet: nuoc mam + chanh + toi ot + nuoc loc.']),
  },
  l10: {
    ingredients: JSON.stringify(['80g thit heo nic (than/mong san) thai mong', '1 bat com ga lut (chin)', '100g gia do, 1/2 bo he', '1 muong dau oliu', '1 muong xi dau diet, hat nem diet, toi bam']),
    steps: JSON.stringify(['Thit heo uop voi xi dau, hat nem va toi bam trong 10 phut.', 'Gia do rua sach, he cat khuc.', 'Phi thom toi dau oliu, xao thit heo chin toi, trut ra dia.', 'Xao gia he voi lua lon trong 1-2 phut, cho thit vao dao deo.', 'Don kem com ga lut. Buoi trua don gian ma ngon com!']),
  },
  d1: {
    ingredients: JSON.stringify(['80g uc ga luoc xe phay', '1/2 banh ngo ngot luoc tach hat', 'Xa lach, ca chua bi', 'Dau oliu, nuoc cot chanh, mot chut muoi hong']),
    steps: JSON.stringify(['Rua sach xa lach va ca chua bi, cat mieng vua an.', 'Pha nuoc xot: 1 muong dau oliu + 1 muong nuoc cot chanh + xi muoi hong.', 'Cho rau cu, ngo ngot va uc ga xe vao to lon.', 'Ruou nuoc xot len tren tron deo.']),
  },
  d2: {
    ingredients: JSON.stringify(['100g thit bo nac (than bo), thai mieng vua an', 'Xa lach, ca chua bi, dua leo', '1 muong dau oliu', '1 muong giam gao, muoi hong, tieu chanh']),
    steps: JSON.stringify(['Thit bo uop muoi tieu, dau oliu trong 10 phut.', 'Pha giam salad: dau oliu + giam gao + muoi hong.', 'Rau cu thai nho, bay ra dia.', 'Ap chao thit bo lua lon moi mat 1.5-2 phut (medium).', 'Thai thit bo lat mong, xep len rau, ruou giam salad.']),
  },
  d3: {
    ingredients: JSON.stringify(['100g tom tuoi boc vo', '1/4 qua bi do thai hat leu', '30g thit nic bam', '1/2 muong dau oliu', 'Hanh tim, muoi, tieu']),
    steps: JSON.stringify(['Tom huong chin (khoang 5-7 phut), de rieng.', 'Phi hanh tim dau oliu, cho thit bam vao xao san.', 'Them bi do va 300ml nuoc, dun soi cho bi mem.', 'Nem muoi tieu vua an, tat bep.', 'Don tom huong kem canh bi do. Nhe nhang thanh dam!']),
  },
  d4: {
    ingredients: JSON.stringify(['1 mieng uc ga (100g) dan mong', 'Ca rot, dua leo, ot chuong thai soi', '1 muong dau oliu', 'Muoi tieu, xi dau diet']),
    steps: JSON.stringify(['Uc ga dan mong, uop muoi tieu xi dau 10 phut.', 'Xep ca rot, dua leo va ot chuong len mot dau mieng uc ga.', 'Cuon chat uc ga lai, dung tam co dinh neu can.', 'Hap cuon uc ga khoang 10-12 phut hoac ap chao den khi chin.', 'Cat khoanh, bay ra dia kem xa lach.']),
  },
  d5: {
    ingredients: JSON.stringify(['1 khuc ca loc (khoang 100g)', '1 cay sup lo xanh cat mieng vua an', '1 nhanh hanh la, 1 lat gung', '1 muong dau oliu', 'Nuoc mam diet, tieu chanh']),
    steps: JSON.stringify(['Ca loc rua sach, khua nhe, uop gung hanh va nuoc mam.', 'Hap ca loc khoang 12-15 phut den khi chin.', 'Sup lo xanh luoc chin toi (3-4 phut sau khi nuoc soi).', 'Bay ca va sup lo ra dia, rac tieu chanh.']),
  },
  d6: {
    ingredients: JSON.stringify(['1 qua dua leo', '2 qua ca chua', '2 qua trung ga luoc', '1 muong dau oliu', '1 muong giam tao, muoi hong, tieu']),
    steps: JSON.stringify(['Dua leo thai lat, ca chua cat muoi cau, xep ra dia.', 'Trung luoc boc vo, cat lat hoac cat doi.', 'Pha dau giam: dau oliu + giam tao + muoi hong + tieu.', 'Ruou so len salad, dung ngay. Buoi toi sieu thanh mat!']),
  },
  d7: {
    ingredients: JSON.stringify(['1 mieng dau hu non (100g)', '2 qua ca chua chin bam nho', '50g nam kim cham hoac nam dui ga', 'Hanh la, 1 tep toi', '1 muong dau oliu, nuoc mam diet, tieu']),
    steps: JSON.stringify(['Dau hu cat mieng vuong, chien vang nhe voi dau oliu.', 'Phi thom toi voi dau oliu, cho ca chua vao xao nhu.', 'Them 100ml nuoc, nam, dun soi, nem nuoc mam diet.', 'Cho dau hu vao, dun them 3 phut, rac hanh la tieu.']),
  },
  d8: {
    ingredients: JSON.stringify(['20g rong bien kho (tam lon)', '50g thit bam nac', '1 mieng dau hu non (50g) cat hat leu', 'Hanh tim bam, 1 lit nuoc', 'Nuoc mam diet, muoi, tieu']),
    steps: JSON.stringify(['Rong bien ngam nuoc lanh 10 phut cho no, rua sach, cat khuc.', 'Phi thom hanh tim, xao thit bam cho san.', 'Do nuoc vao noi, dun soi, tha dau hu va rong bien vao.', 'Nem nuoc mam diet va muoi, dun 5 phut, rac tieu truoc khi tat bep.']),
  },
  d9: {
    ingredients: JSON.stringify(['1 banh ngo ngot luoc tach hat', '60g thit nic bam', '50g nam moc nhi (meo) ngam no, thai soi', 'Hanh la, 1 tep toi', '1 muong dau oliu, nuoc mam diet, tieu']),
    steps: JSON.stringify(['Phi thom toi hanh voi dau oliu, cho thit bam vao xao san.', 'Them nam moc nhi vao xao chung 3 phut.', 'Nem nuoc mam diet va tieu, trut ra dia.', 'Banh ngo ngot luoc de nguyen hat hoac tach hat, dung kem thit xao nam.']),
  },
};

async function main() {
  console.log('Seeding database...');

  for (const meal of mealsData) {
    const recipe = recipesData[meal.id];
    await prisma.meal.upsert({
      where: { id: meal.id },
      update: {},
      create: {
        id: meal.id,
        name: meal.name,
        type: meal.type,
        calories: meal.calories,
        time: meal.time,
        servings: meal.servings,
        ingredients: recipe?.ingredients || '[]',
        steps: recipe?.steps || '[]',
      },
    });
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@eatclean.com' },
    update: {},
    create: {
      email: 'admin@eatclean.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  });

  console.log('Seeding complete!');
  console.log('Admin login: admin@eatclean.com / admin123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
