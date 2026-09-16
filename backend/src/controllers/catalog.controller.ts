import { Response } from 'express';
import { ServiceCategory } from '../models/ServiceCategory';
import { VendorProfile } from '../models/VendorProfile';
import { Coupon } from '../models/Coupon';
import { Faq } from '../models/Misc';
import { Favorite } from '../models/Favorite';
import { AppError } from '../utils/errors';
import { paginate, parsePagination, success } from '../utils/response';
import { haversineKm, publicVendor } from '../utils/serializers';
import { resolveCoupon } from '../utils/coupons';
import { AuthedRequest } from '../middleware/auth';

export async function listServices(req: AuthedRequest, res: Response) {
  const category = req.query.category as string | undefined;
  const q = (req.query.q as string | undefined)?.trim();
  const filter: Record<string, unknown> = { isActive: true };
  if (category && category !== 'All') filter.category = category;
  if (q) filter.name = { $regex: q, $options: 'i' };
  const items = await ServiceCategory.find(filter).sort({ sortOrder: 1 }).lean();
  return success(res, 'Services fetched successfully', { items });
}

export async function listVendors(req: AuthedRequest, res: Response) {
  const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);
  const q = (req.query.q as string | undefined)?.trim();
  const category = req.query.category as string | undefined;
  const city = req.query.city as string | undefined;
  const type = req.query.type as string | undefined;
  const sort = (req.query.sort as string | undefined) || 'recommended';
  const minRating = Number(req.query.minRating || 0);
  const onlyVerified = String(req.query.onlyVerified || '') === 'true';
  const priceMin = Number(req.query.priceMin || 0);
  const priceMax = Number(req.query.priceMax || 0);
  const lat = Number(req.query.lat || 0);
  const lng = Number(req.query.lng || 0);
  const maxKm = Number(req.query.maxKm || 0);

  const filter: Record<string, unknown> = {};
  const and: Record<string, unknown>[] = [];
  if (category && category !== 'All') {
    and.push({
      $or: [
        { categorySlug: category.toLowerCase() },
        { category: { $regex: category, $options: 'i' } },
      ],
    });
  }
  if (q) {
    and.push({
      $or: [
        { businessName: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
      ],
    });
  }
  if (and.length) filter.$and = and;
  if (city) filter.city = { $regex: city, $options: 'i' };
  if (type && type !== 'All') filter.type = type;
  if (minRating) filter.rating = { $gte: minRating };
  if (onlyVerified) filter.isVerified = true;
  if (priceMin || priceMax) {
    filter.startingPrice = {
      ...(priceMin ? { $gte: priceMin } : {}),
      ...(priceMax ? { $lte: priceMax } : {}),
    };
  }

  if (lat && lng && maxKm > 0) {
    filter.location = {
      $geoWithin: {
        $centerSphere: [[lng, lat], maxKm / 6378.1],
      },
    };
  }

  let sortSpec: Record<string, 1 | -1> = { rating: -1, reviewsCount: -1 };
  if (sort === 'price_low') sortSpec = { startingPrice: 1 };
  if (sort === 'price_high') sortSpec = { startingPrice: -1 };
  if (sort === 'rating') sortSpec = { rating: -1 };

  const [rows, total] = await Promise.all([
    VendorProfile.find(filter).sort(sortSpec).skip(skip).limit(limit),
    VendorProfile.countDocuments(filter),
  ]);

  let favoriteIds = new Set<string>();
  if (req.userId) {
    const favs = await Favorite.find({ user: req.userId }).select('vendorProfile').lean();
    favoriteIds = new Set(favs.map((f) => String(f.vendorProfile)));
  }

  let items = rows.map((v) => {
    const extra: Record<string, unknown> = {
      isFavorite: favoriteIds.has(String(v._id)),
    };
    if (lat && lng) {
      const [vlng, vlat] = v.location.coordinates;
      extra.distanceKm = haversineKm(lat, lng, vlat, vlng);
      extra.distance = `${extra.distanceKm} KM`;
    }
    return publicVendor(v, extra);
  }) as Array<ReturnType<typeof publicVendor> & { distanceKm?: number }>;

  if (sort === 'distance' && lat && lng) {
    items.sort((a, b) => Number(a.distanceKm || 0) - Number(b.distanceKm || 0));
  }

  return success(res, 'Vendors fetched successfully', {
    items,
    pagination: paginate(page, limit, total),
  });
}

export async function getVendor(req: AuthedRequest, res: Response) {
  const vendor = await VendorProfile.findById(req.params.id);
  if (!vendor) throw new AppError('Vendor not found', 404);
  let isFavorite = false;
  if (req.userId) {
    isFavorite = Boolean(
      await Favorite.exists({ user: req.userId, vendorProfile: vendor._id }),
    );
  }
  return success(res, 'Vendor fetched successfully', {
    vendor: publicVendor(vendor, { isFavorite }),
  });
}

export async function locationStats(req: AuthedRequest, res: Response) {
  const city = String(req.query.city || 'Indore');
  const count = await VendorProfile.countDocuments({
    city: { $regex: city, $options: 'i' },
  });
  return success(res, 'Location stats fetched', {
    city,
    activeVendorsCount: count,
  });
}

export async function listCoupons(req: AuthedRequest, res: Response) {
  const category = req.query.category as string | undefined;
  const now = new Date();
  const filter: Record<string, unknown> = {
    isActive: true,
    $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: now } }],
  };
  if (category && category !== 'all') filter.category = category;
  const items = await Coupon.find(filter).sort({ isPopular: -1, createdAt: -1 }).lean();
  return success(res, 'Coupons fetched successfully', { items });
}

export async function applyCoupon(req: AuthedRequest, res: Response) {
  const code = String(req.body.code || '');
  const amount = Number(req.body.amount || 0);
  const { coupon, discount } = await resolveCoupon(code, amount, req.userId);
  return success(res, 'Coupon applied successfully', {
    coupon,
    discount,
    payable: Math.max(amount - discount, 0),
  });
}

export async function listFaqs(_req: AuthedRequest, res: Response) {
  const items = await Faq.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
  return success(res, 'FAQs fetched successfully', { items });
}
