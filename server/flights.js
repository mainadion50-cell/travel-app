// =============================================
// flights.js - Seed Kenya Domestic Flights
// Run: node flights.js
// Place this file in: server/
// =============================================

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Trip = require('./models/Trip');
const User = require('./models/User');

dotenv.config();

// ── Helper: generate a date N days from now ──
const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

// ── We need an organizer ObjectId — we'll use the admin ──
const seedFlights = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the admin user to use as organizer
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('❌ Admin user not found. Run seedAdmin.js first.');
      process.exit(1);
    }

    // Clear existing trips seeded by this script (optional — remove if you want to keep old data)
    await Trip.deleteMany({ organizer: admin._id });
    console.log('🧹 Cleared previous flight seeds');

    // ── REAL Jambojet Kenya domestic routes with actual prices (KES) ──
    // Sources: jambojet.com, elisatravel.co.ke (2025)
    const flights = [

      // ─── FROM NAIROBI (JKIA) ───────────────────────────────────────────
      {
        title: 'Nairobi → Mombasa | Morning Flight',
        description:
          'Daily morning flight from JKIA to Moi International Airport, Mombasa. ' +
          '~1hr 15min flight. Great for coast getaways, business travel, and beach holidays.',
        destination: 'Mombasa (MBA) — Moi International Airport',
        startDate: daysFromNow(3),
        endDate: daysFromNow(3),
        budget: 8300,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: JKIA Terminal 1D, 06:00 | Arrival: MBA 07:15 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82',
      },
      {
        title: 'Nairobi → Mombasa | Afternoon Flight',
        description:
          'Afternoon departure from JKIA to Mombasa. Up to 10 daily flights available. ' +
          'Perfect for day-trippers and weekend getaways to the Kenyan coast.',
        destination: 'Mombasa (MBA) — Moi International Airport',
        startDate: daysFromNow(5),
        endDate: daysFromNow(5),
        budget: 9500,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: JKIA Terminal 1D, 14:00 | Arrival: MBA 15:15 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82',
      },

      {
        title: 'Nairobi → Kisumu | Morning Flight',
        description:
          'Daily flight from Nairobi to Kisumu International Airport. ~1hr flight. ' +
          'Kisumu is Kenya\'s third largest city, gateway to Lake Victoria and western Kenya.',
        destination: 'Kisumu (KIS) — Kisumu International Airport',
        startDate: daysFromNow(4),
        endDate: daysFromNow(4),
        budget: 7500,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: JKIA Terminal 1D, 07:30 | Arrival: KIS 08:35 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82',
      },

      {
        title: 'Nairobi → Eldoret | Daily Flight',
        description:
          'Daily flight from JKIA to Eldoret Airport. ~50min flight. ' +
          'Eldoret is home to Kenya\'s famous athletics community and the Rift Valley highlands.',
        destination: 'Eldoret (EDL) — Eldoret International Airport',
        startDate: daysFromNow(6),
        endDate: daysFromNow(6),
        budget: 7000,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: JKIA Terminal 1D, 09:00 | Arrival: EDL 09:50 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82',
      },

      {
        title: 'Nairobi → Malindi | Daily Flight',
        description:
          'Daily flight from JKIA to Malindi Airport. ~1hr 20min flight. ' +
          'Malindi is a beautiful coastal town known for its marine park, beaches, and culture.',
        destination: 'Malindi (MYD) — Malindi Airport',
        startDate: daysFromNow(7),
        endDate: daysFromNow(7),
        budget: 8500,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: JKIA Terminal 1D, 10:30 | Arrival: MYD 11:50 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82',
      },

      {
        title: 'Nairobi → Diani (Ukunda) | Daily Flight',
        description:
          'Daily flight from JKIA to Ukunda Airport, serving Diani Beach. ~1hr 20min. ' +
          'Diani is one of Africa\'s top beach destinations — white sand, coral reefs, and resorts.',
        destination: 'Diani Beach (UKA) — Ukunda Airport',
        startDate: daysFromNow(8),
        endDate: daysFromNow(8),
        budget: 8800,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: JKIA Terminal 1D, 11:00 | Arrival: UKA 12:20 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82',
      },

      {
        title: 'Nairobi → Lamu | Daily Flight',
        description:
          'Daily flight from JKIA to Manda Airport, Lamu. ~1hr 35min. ' +
          'Lamu is a UNESCO World Heritage site — ancient Swahili architecture, no cars, pure magic.',
        destination: 'Lamu (LAU) — Manda Airport',
        startDate: daysFromNow(10),
        endDate: daysFromNow(10),
        budget: 9500,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: JKIA Terminal 1D, 08:00 | Arrival: LAU 09:35 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82',
      },

      // ─── FROM MOMBASA ──────────────────────────────────────────────────
      {
        title: 'Mombasa → Nairobi | Morning Flight',
        description:
          'Morning return flight from Mombasa to JKIA Nairobi. ~1hr 15min. ' +
          'Ideal for coast travellers heading back to Nairobi or connecting to international flights.',
        destination: 'Nairobi (NBO) — JKIA Terminal 1D',
        startDate: daysFromNow(4),
        endDate: daysFromNow(4),
        budget: 8300,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: MBA 08:00 | Arrival: JKIA 09:15 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82',
      },
      {
        title: 'Mombasa → Kisumu | Direct Flight (Fri & Sun)',
        description:
          'Direct flight from Mombasa to Kisumu — no Nairobi stopover! ~2hr 40min. ' +
          'Available Fridays and Sundays. Connects the Coast directly to western Kenya.',
        destination: 'Kisumu (KIS) — Kisumu International Airport',
        startDate: daysFromNow(5),
        endDate: daysFromNow(5),
        budget: 8900,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: MBA 12:00 | Arrival: KIS 14:40 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82 | ' +
          'Note: Direct flights Fri & Sun only. Daily via Nairobi also available.',
      },
      {
        title: 'Mombasa → Eldoret | Direct Flight',
        description:
          'Direct flight from Moi International Airport, Mombasa to Eldoret. ' +
          'Convenient connection between the coast and the Rift Valley highlands.',
        destination: 'Eldoret (EDL) — Eldoret International Airport',
        startDate: daysFromNow(9),
        endDate: daysFromNow(9),
        budget: 9200,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: MBA 13:00 | Arrival: EDL 15:00 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82',
      },
      {
        title: 'Mombasa → Zanzibar | Direct Flight',
        description:
          'Direct flight from Mombasa to Zanzibar International Airport. ~45min flight. ' +
          'Island-hopping made easy — from Kenya\'s coast to Tanzania\'s spice island.',
        destination: 'Zanzibar (ZNZ) — Zanzibar International Airport',
        startDate: daysFromNow(12),
        endDate: daysFromNow(12),
        budget: 10500,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: MBA 10:00 | Arrival: ZNZ 10:45 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82',
      },

      // ─── RETURN ROUTES ─────────────────────────────────────────────────
      {
        title: 'Kisumu → Nairobi | Return Flight',
        description:
          'Return flight from Kisumu to JKIA Nairobi. ~1hr flight. ' +
          'Convenient scheduling for business travellers and western Kenya visitors.',
        destination: 'Nairobi (NBO) — JKIA Terminal 1D',
        startDate: daysFromNow(11),
        endDate: daysFromNow(11),
        budget: 7500,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: KIS 16:00 | Arrival: JKIA 17:00 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82',
      },
      {
        title: 'Eldoret → Nairobi | Return Flight',
        description:
          'Return flight from Eldoret to JKIA. ~50min flight. ' +
          'Easy return journey for highland and Rift Valley travellers.',
        destination: 'Nairobi (NBO) — JKIA Terminal 1D',
        startDate: daysFromNow(13),
        endDate: daysFromNow(13),
        budget: 7000,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: EDL 17:00 | Arrival: JKIA 17:50 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82',
      },
      {
        title: 'Lamu → Nairobi | Return Flight',
        description:
          'Return flight from Manda Airport, Lamu to JKIA. ~1hr 35min. ' +
          'Head back to Nairobi after your island escape.',
        destination: 'Nairobi (NBO) — JKIA Terminal 1D',
        startDate: daysFromNow(14),
        endDate: daysFromNow(14),
        budget: 9500,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: LAU 11:00 | Arrival: JKIA 12:35 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82',
      },
      {
        title: 'Malindi → Nairobi | Return Flight',
        description:
          'Return flight from Malindi Airport to JKIA. ~1hr 20min. ' +
          'Perfect for wrapping up your coastal Malindi trip.',
        destination: 'Nairobi (NBO) — JKIA Terminal 1D',
        startDate: daysFromNow(14),
        endDate: daysFromNow(14),
        budget: 8500,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: MYD 15:00 | Arrival: JKIA 16:20 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82',
      },
      {
        title: 'Diani → Nairobi | Return Flight',
        description:
          'Return flight from Ukunda Airport (Diani Beach) to JKIA. ~1hr 20min. ' +
          'Head back to Nairobi from your Diani Beach getaway.',
        destination: 'Nairobi (NBO) — JKIA Terminal 1D',
        startDate: daysFromNow(15),
        endDate: daysFromNow(15),
        budget: 8800,
        organizer: admin._id,
        status: 'upcoming',
        itinerary:
          'Departure: UKA 16:00 | Arrival: JKIA 17:20 | ' +
          'Operator: Jambojet (JM) | Aircraft: Bombardier Dash 8 Q400 | Seats: 82',
      },
    ];

    await Trip.insertMany(flights);
    console.log(`✅ ${flights.length} Jambojet flights seeded successfully!`);
    console.log('');
    console.log('Routes seeded:');
    flights.forEach((f, i) => console.log(`  ${i + 1}. ${f.title} — KES ${f.budget.toLocaleString()}`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedFlights();