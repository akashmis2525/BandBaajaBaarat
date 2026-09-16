import { connectDatabase, disconnectDatabase } from './config/db';
import { User } from './models/User';
import { VendorProfile } from './models/VendorProfile';
import { ServiceCategory } from './models/ServiceCategory';
import { Coupon } from './models/Coupon';
import { Faq } from './models/Misc';
import { generateReferralCode, hashValue } from './utils/crypto';

const categories = [
  { slug: 'dhol', name: 'Dhol', tagline: 'Make every beat special', vendorsCount: 120, imageKey: 'serviceDhol', category: 'Wedding Services', sortOrder: 1 },
  { slug: 'band-baaja', name: 'Band Baaja', tagline: 'Traditional to Royal', vendorsCount: 80, imageKey: 'serviceBrassBand', category: 'Wedding Services', sortOrder: 2 },
  { slug: 'buggi', name: 'Buggi / Ghodi', tagline: 'Ride in Royal Style', vendorsCount: 60, imageKey: 'serviceBuggi', category: 'Wedding Services', sortOrder: 3 },
  { slug: 'dj', name: 'DJ Services', tagline: 'Feel the Celebration', vendorsCount: 150, imageKey: 'serviceDj', category: 'Entertainment', sortOrder: 4 },
  { slug: 'mehndi', name: 'Mehndi Artist', tagline: 'Beautiful Hands, Happier Moments', vendorsCount: 200, imageKey: 'serviceMehndi', category: 'Wedding Services', sortOrder: 5 },
  { slug: 'photographer', name: 'Photographer', tagline: 'Capture Your Forever', vendorsCount: 250, imageKey: 'servicePhotography', category: 'Wedding Services', sortOrder: 6 },
  { slug: 'videographer', name: 'Videographer', tagline: 'Relive Your Moments', vendorsCount: 180, imageKey: 'servicePhotography', category: 'Wedding Services', sortOrder: 7 },
  { slug: 'wedding-dress', name: 'Wedding Dress', tagline: 'Bridal & Groom Collection', vendorsCount: 300, imageKey: 'serviceDresses', category: 'Shopping', sortOrder: 8 },
  { slug: 'jewellery', name: 'Jewellery', tagline: 'Artificial & Real', vendorsCount: 220, imageKey: 'serviceJewellery', category: 'Shopping', sortOrder: 9 },
  { slug: 'shoes', name: 'Shoes', tagline: 'Step into Style', vendorsCount: 100, imageKey: 'serviceShoes', category: 'Shopping', sortOrder: 10 },
  { slug: 'clothes', name: 'Clothes', tagline: 'For Every Occasion', vendorsCount: 250, imageKey: 'serviceClothes', category: 'Shopping', sortOrder: 11 },
  { slug: 'puja-samagri', name: 'Puja Path Samagri', tagline: 'Shubh Shuruaat', vendorsCount: 90, imageKey: 'serviceDecorators', category: 'Essentials', sortOrder: 12 },
  { slug: 'decoration', name: 'Decoration', tagline: 'Turn Spaces into Stories', vendorsCount: 200, imageKey: 'serviceDecorators', category: 'Wedding Services', sortOrder: 13 },
  { slug: 'makeup', name: 'Makeup Artist', tagline: 'Look Your Best', vendorsCount: 180, imageKey: 'serviceMehndi', category: 'Wedding Services', sortOrder: 14 },
  { slug: 'catering', name: 'Catering', tagline: 'Deliciously Memorable', vendorsCount: 160, imageKey: 'serviceDecorators', category: 'Essentials', sortOrder: 15 },
  { slug: 'venue', name: 'Venue / Marriage Garden', tagline: 'Perfect Place, Perfect Day', vendorsCount: 110, imageKey: 'weddingMandapArt', category: 'Wedding Services', sortOrder: 16 },
  { slug: 'wedding-car', name: 'Wedding Car', tagline: 'Arrive in Elegance', vendorsCount: 120, imageKey: 'serviceBuggi', category: 'Wedding Services', sortOrder: 17 },
  { slug: 'furniture', name: 'Furniture / Event Rental', tagline: 'Everything You Need', vendorsCount: 140, imageKey: 'serviceDecorators', category: 'Essentials', sortOrder: 18 },
  { slug: 'gifts', name: 'Gifts & Return Gifts', tagline: 'Thoughtful Memories', vendorsCount: 90, imageKey: 'serviceJewellery', category: 'Shopping', sortOrder: 19 },
] as const;

const coupons = [
  { code: 'SHUBHVIVAH', discountType: 'percentage', discountText: '20% OFF', title: 'Grand Wedding Season Special', description: 'Get 20% instant discount up to ₹10,000 on Mandap, Decor & Catering bookings.', minBookingAmount: 50000, maxDiscount: 10000, discountValue: 20, expiryDate: 'Valid till 30 Nov 2026', expiresAt: new Date('2026-11-30T23:59:59.000Z'), category: 'wedding', isPopular: true },
  { code: 'FIRSTBAARAT', discountType: 'flat', discountText: 'FLAT ₹2,500', title: 'Welcome New Couple Offer', description: 'Flat ₹2,500 off on your first vendor booking with Band Baaja Baarat.', minBookingAmount: 15000, discountValue: 2500, expiryDate: 'Valid till 31 Dec 2026', expiresAt: new Date('2026-12-31T23:59:59.000Z'), category: 'first', isPopular: true },
  { code: 'ROYALDHOL', discountType: 'flat', discountText: '₹1,500 OFF', title: 'Dhol & Brass Band Bonanza', description: 'Flat ₹1,500 off on Dhol, Band Baaja and Tasha bookings.', minBookingAmount: 8000, discountValue: 1500, expiryDate: 'Valid till 31 Dec 2026', expiresAt: new Date('2026-12-31T23:59:59.000Z'), category: 'vendor', isPopular: false },
  { code: 'GLAMMAKEUP', discountType: 'percentage', discountText: '15% OFF', title: 'Bridal Glow Offer', description: '15% off up to ₹4,000 on bridal makeup packages.', minBookingAmount: 10000, maxDiscount: 4000, discountValue: 15, expiryDate: 'Valid till 31 Dec 2026', expiresAt: new Date('2026-12-31T23:59:59.000Z'), category: 'vendor', isPopular: false },
  { code: 'CASHBACK5000', discountType: 'cashback', discountText: '₹5,000 CASHBACK', title: 'Wallet Cashback Special', description: 'Get ₹5,000 cashback on bookings above ₹75,000.', minBookingAmount: 75000, discountValue: 5000, expiryDate: 'Valid till 31 Jan 2027', expiresAt: new Date('2027-01-31T23:59:59.000Z'), category: 'cashback', isPopular: true },
] as const;

const faqs = [
  { question: 'How do I book a service?', answer: 'Browse our verified wedding services from the Services tab, select your preferred vendor (e.g. Dhol, Band Baaja, DJ), choose your event date & time window, review pricing and pay securely.', sortOrder: 1 },
  { question: 'Can I cancel or reschedule my booking?', answer: 'Yes! You can reschedule or cancel any booking from "My Bookings" -> "Booking Details" with free cancellation up to 48 hours before the event.', sortOrder: 2 },
  { question: 'How do I get a refund?', answer: 'Upon cancellation, 100% refund is initiated automatically to your original payment method (UPI/Card/Bank) within 2-4 business hours.', sortOrder: 3 },
  { question: 'What payment methods are accepted?', answer: 'We support Google Pay, PhonePe, Paytm, all major UPI apps, Visa, Mastercard, RuPay, Net Banking across 30+ banks, and Wallets.', sortOrder: 4 },
  { question: 'How do I contact a vendor?', answer: 'Once booked, you can directly call or live chat with the vendor from the Chat tab or Booking Details page.', sortOrder: 5 },
];

const vendors = [
  { phone: '9826012345', email: 'contact@royalevents.in', businessName: 'Royal Events & Decor', category: 'Mandap & Stage Decor', categorySlug: 'decoration', city: 'Indore', startingPrice: 45000, rating: 4.8, reviewsCount: 320, experienceYears: 8, imageKey: 'serviceDecorators', type: 'Professional Group' as const, features: ['Grand Mandap', 'Floral Entry', 'LED Canopy'], bio: 'Premier luxury wedding decorators in central India with over 800+ completed wedding setups.', address: '301, Shekhar Central, MG Road, Indore' },
  { phone: '9826011111', email: 'sharma@dhol.in', businessName: 'Sharma Dhol Group', category: 'Dhol', categorySlug: 'dhol', city: 'Indore', startingPrice: 8000, rating: 4.8, reviewsCount: 320, experienceYears: 8, imageKey: 'groomBaarat', type: 'Professional Group' as const, features: ['4 Punjabi Dhol Players', 'Tasha', 'Traditional Poshak'] },
  { phone: '9826011112', email: 'royalbeats@dhol.in', businessName: 'Royal Beats Dhol Group', category: 'Dhol', categorySlug: 'dhol', city: 'Indore', startingPrice: 5999, rating: 4.6, reviewsCount: 210, experienceYears: 5, imageKey: 'weddingMandapArt', type: 'Professional Group' as const, features: ['LED Dhol', 'Punjabi Beats', 'Baarat Entry'] },
  { phone: '9826011113', email: 'narmada@dhol.in', businessName: 'Maa Narmada Dhol Group', category: 'Dhol', categorySlug: 'dhol', city: 'Indore', startingPrice: 12000, rating: 4.9, reviewsCount: 486, experienceYears: 12, imageKey: 'serviceDhol', type: 'Professional Group' as const, features: ['12 Years Experience'] },
  { phone: '9826011114', email: 'artist@dhol.in', businessName: 'Indore Dhol Artist', category: 'Dhol', categorySlug: 'dhol', city: 'Indore', startingPrice: 5000, rating: 4.5, reviewsCount: 132, experienceYears: 3, imageKey: 'serviceDj', type: 'Individual Artist' as const, features: ['Solo Artist'] },
  { phone: '9826011115', email: 'click@studio.in', businessName: 'Click Studio Photography', category: 'Photographer', categorySlug: 'photographer', city: 'Indore', startingPrice: 15000, rating: 4.7, reviewsCount: 486, experienceYears: 7, imageKey: 'servicePhotography', type: 'Professional Group' as const, features: ['Cinematic', 'Drone'] },
  { phone: '9826011116', email: 'buggi@royal.in', businessName: 'Royal Buggi Service', category: 'Buggi / Ghodi', categorySlug: 'buggi', city: 'Indore', startingPrice: 12000, rating: 4.6, reviewsCount: 210, experienceYears: 6, imageKey: 'serviceBuggi', type: 'Professional Group' as const, features: ['Decorated Buggi'] },
  { phone: '9826011117', email: 'rida@mehndi.in', businessName: 'Mehndi by Rida', category: 'Mehndi Artist', categorySlug: 'mehndi', city: 'Indore', startingPrice: 3000, rating: 4.9, reviewsCount: 632, experienceYears: 9, imageKey: 'serviceMehndi', type: 'Individual Artist' as const, features: ['Bridal Mehndi'] },
  { phone: '9826011118', email: 'palace@venue.in', businessName: 'The Grand Palace', category: 'Venue / Marriage Garden', categorySlug: 'venue', city: 'Indore', startingPrice: 75000, rating: 4.8, reviewsCount: 320, experienceYears: 15, imageKey: 'serviceDecorators', type: 'Professional Group' as const, features: ['AC Banquet Hall', '500-1500 Guests', 'In-house Catering', 'Valet Parking'] },
  { phone: '9826011119', email: 'glam@makeup.in', businessName: 'Glam Look Makeup Studio', category: 'Makeup Artist', categorySlug: 'makeup', city: 'Indore', startingPrice: 12000, rating: 4.7, reviewsCount: 180, experienceYears: 8, imageKey: 'serviceMehndi', type: 'Professional Group' as const, features: ['HD Airbrush Makeup', 'Hair Styling'] },
  { phone: '9826011120', email: 'shivam@cars.in', businessName: 'Shivam Car Rentals', category: 'Wedding Car', categorySlug: 'wedding-car', city: 'Indore', startingPrice: 8000, rating: 4.6, reviewsCount: 95, experienceYears: 10, imageKey: 'serviceBuggi', type: 'Professional Group' as const, features: ['Luxury Audi A4 / BMW', 'Chauffeur'] },
  { phone: '9826011121', email: 'shree@cater.in', businessName: 'Shree Caterers', category: 'Catering', categorySlug: 'catering', city: 'Indore', startingPrice: 600, rating: 4.5, reviewsCount: 210, experienceYears: 12, imageKey: 'serviceClothes', type: 'Professional Group' as const, features: ['50+ Pure Veg Delicacies'] },
];

async function upsertVendor(entry: (typeof vendors)[number]) {
  let user = await User.findOne({ phone: entry.phone, role: 'vendor' });
  if (!user) {
    user = await User.create({
      role: 'vendor',
      phone: entry.phone,
      email: entry.email,
      name: entry.businessName,
      passwordHash: await hashValue('Vendor@123'),
      referralCode: generateReferralCode(entry.phone),
      isProfileComplete: true,
      isKycComplete: true,
      city: entry.city,
      state: 'Madhya Pradesh',
    });
  } else {
    user.email = entry.email;
    user.name = entry.businessName;
    user.isKycComplete = true;
    user.isProfileComplete = true;
    if (!user.passwordHash) user.passwordHash = await hashValue('Vendor@123');
    await user.save();
  }

  await VendorProfile.findOneAndUpdate(
    { user: user._id },
    {
      user: user._id,
      businessName: entry.businessName,
      category: entry.category,
      categorySlug: entry.categorySlug,
      city: entry.city,
      state: 'Madhya Pradesh',
      address: 'address' in entry ? entry.address : `${entry.city}, Madhya Pradesh`,
      location: { type: 'Point', coordinates: [75.8577, 22.7196] },
      experienceYears: entry.experienceYears,
      experienceText: `${entry.experienceYears}+ Years`,
      startingPrice: entry.startingPrice,
      startingPriceText: `₹${entry.startingPrice.toLocaleString('en-IN')} onwards`,
      priceUnit: entry.categorySlug === 'catering' ? 'Per Plate' : 'Starting Price',
      type: entry.type,
      isVerified: true,
      isOnline: true,
      isAvailable: true,
      rating: entry.rating,
      reviewsCount: entry.reviewsCount,
      photosCount: 6,
      imageKey: entry.imageKey,
      features: entry.features,
      bio: 'bio' in entry ? entry.bio : `${entry.businessName} — trusted wedding partner in ${entry.city}.`,
      displayPhone: `+91 ${entry.phone}`,
      kyc: { payoutMethod: 'bank', docsUploaded: true, status: 'verified' },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

export async function seedDatabase() {
  for (const cat of categories) {
    await ServiceCategory.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true });
  }
  for (const coupon of coupons) {
    await Coupon.findOneAndUpdate({ code: coupon.code }, { ...coupon, isActive: true }, { upsert: true });
  }
  if ((await Faq.countDocuments()) === 0) {
    await Faq.insertMany(faqs.map((f) => ({ ...f, isActive: true })));
  }
  for (const vendor of vendors) {
    await upsertVendor(vendor);
  }
}

async function run() {
  if (process.env.NODE_ENV === 'production') {
    console.error('Refusing to seed a production database. Seed is staging/development only.');
    process.exit(1);
  }
  await connectDatabase();
  await seedDatabase();
  console.log('Seed completed (staging/development only)');
  await disconnectDatabase();
}

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
