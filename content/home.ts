export const photos = {
  hero: "1545642412-2fb9732aac99",
  ship: "1783197287675-9c0fbbcb4b9d",
  inspection: "1625047509248-ec889cbff17f",
  carrier: "1761993600321-757e086491c0",
  interior: "1760130426888-7c15a56a7f2b",
};

export const stages = ["Bought", "At sea", "Customs", "Ready"] as const;

export type CarInTransit = {
  model: string;
  year: number;
  mileage: string;
  engine: string;
  route: string;
  landed: number;
  stage: number;
  eta: string;
};

export const carsInTransit: CarInTransit[] = [
  { model: "BMW X5 xDrive40i", year: 2021, mileage: "38,200 mi", engine: "3.0 petrol", route: "Savannah to Bay Harbor", landed: 41900, stage: 1, eta: "Arrives in 12 days" },
  { model: "Tesla Model Y Long Range", year: 2022, mileage: "24,700 mi", engine: "Electric", route: "Newark to Bay Harbor", landed: 33400, stage: 2, eta: "In customs, 3 days" },
  { model: "Audi Q5 45 TFSI", year: 2020, mileage: "61,000 km", engine: "2.0 petrol", route: "Bremerhaven to Bay Harbor", landed: 29800, stage: 3, eta: "Ready for handover" },
  { model: "Ford Escape Hybrid", year: 2022, mileage: "19,300 mi", engine: "2.5 hybrid", route: "Baltimore to Bay Harbor", landed: 24600, stage: 1, eta: "Arrives in 19 days" },
  { model: "Volvo XC60 B5", year: 2021, mileage: "54,000 km", engine: "2.0 mild hybrid", route: "Antwerp to Bay Harbor", landed: 34100, stage: 0, eta: "Leaves port in 4 days" },
  { model: "Jeep Grand Cherokee L", year: 2021, mileage: "42,800 mi", engine: "3.6 petrol", route: "Houston to Bay Harbor", landed: 38700, stage: 1, eta: "Arrives in 26 days" },
];

export const steps = [
  { title: "Search", text: "Tell us the model, budget and must-haves. We send a shortlist from auctions and dealers within 48 hours." },
  { title: "Inspection", text: "Our partner checks the car in person: paint thickness, underbody, diagnostics and a test drive, with 60+ photos." },
  { title: "Purchase", text: "We bid or negotiate on your behalf. You pay the seller through escrow, never to a personal account." },
  { title: "Shipping", text: "Inland truck to the port, then a container or roll-on ship. You get the tracking link and the bill of lading." },
  { title: "Handover", text: "We clear customs, register the car and hand it over washed, serviced and with a full tank." },
];

export const reviews = [
  { name: "Daniel R.", car: "2021 BMW X5", text: "The inspection report flagged a repainted door the auction photos hid. We passed on that one and found a cleaner car a week later." },
  { name: "Marta K.", car: "2022 Tesla Model Y", text: "Seven weeks from the first call to the keys. Every stage was on the tracking page before I thought to ask." },
  { name: "Oliver P.", car: "2020 Audi Q5", text: "The final bill matched the estimate to within $300, and they showed me every receipt that made up the difference." },
];

export const faqs = [
  { q: "How much can I save compared with buying locally?", a: "On popular SUVs and EVs the difference is usually 15 to 25% after all costs. On cheap or very old cars it rarely makes sense, and we will tell you so." },
  { q: "What if the car arrives with damage?", a: "Every car travels insured for its full value. Any transport damage is photographed at the port and repaired or compensated before handover." },
  { q: "Can I choose a car I found myself?", a: "Yes. Send the listing link and we will check its history, arrange an inspection and give you a landed cost before you commit." },
];
