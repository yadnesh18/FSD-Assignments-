/**
 * Database Seeder
 * Run: npm run seed
 */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./db');

dotenv.config();

const Product = require('../models/Product');
const User = require('../models/User');

const sampleProducts = [
  {
    name: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear audio with our premium noise-canceling wireless headphones. 40-hour battery life, foldable design, and premium materials.',
    price: 2999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stock: 50,
    ratings: 4.5,
    numReviews: 128,
  },
  {
    name: 'Running Shoes Pro X',
    description: 'Engineered for performance with responsive cushioning and breathable mesh upper. Perfect for daily training and marathon runs.',
    price: 4499,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    stock: 30,
    ratings: 4.3,
    numReviews: 89,
  },
  {
    name: 'Smart Watch Series 5',
    description: 'Monitor your health 24/7 with heart rate, SpO2, and sleep tracking. Water resistant up to 50m with a vibrant AMOLED display.',
    price: 8999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    stock: 25,
    ratings: 4.7,
    numReviews: 203,
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Handcrafted genuine leather crossbody bag with adjustable strap, multiple compartments, and antique brass hardware.',
    price: 3499,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
    stock: 15,
    ratings: 4.2,
    numReviews: 45,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches, N-key rollover, and aircraft-grade aluminum frame.',
    price: 6499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500',
    stock: 40,
    ratings: 4.6,
    numReviews: 156,
  },
  {
    name: 'Organic Green Tea Set',
    description: 'Premium organic green tea collection from the mountains of Darjeeling. Includes 5 varieties in a beautiful gift box.',
    price: 899,
    category: 'Food & Beverage',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500',
    stock: 100,
    ratings: 4.4,
    numReviews: 72,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick 6mm non-slip yoga mat with alignment lines, carrying strap, and eco-friendly TPE material.',
    price: 1299,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1601925228232-c05f0d94e0f3?w=500',
    stock: 60,
    ratings: 4.1,
    numReviews: 98,
  },
  {
    name: 'Linen Casual Shirt',
    description: 'Breathable 100% linen shirt with a relaxed fit. Perfect for summer days and casual evenings. Available in multiple colors.',
    price: 1799,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
    stock: 80,
    ratings: 4.0,
    numReviews: 34,
  },
  {
    name: 'Bluetooth Speaker Mini',
    description: 'Portable waterproof speaker with 360° sound, 12-hour playback, and built-in microphone. Pairs with two devices simultaneously.',
    price: 2199,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    stock: 45,
    ratings: 4.5,
    numReviews: 117,
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted ceramic mugs in earthy tones. Microwave and dishwasher safe, holds 350ml each.',
    price: 1199,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500',
    stock: 70,
    ratings: 4.3,
    numReviews: 61,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated bottle keeps drinks cold 24hrs/hot 12hrs. BPA-free, leak-proof lid, 750ml capacity.',
    price: 999,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    stock: 120,
    ratings: 4.6,
    numReviews: 189,
  },
  {
    name: 'Wooden Desk Organizer',
    description: 'Minimalist bamboo desk organizer with 6 compartments, phone stand, and cable management. Eco-friendly and stylish.',
    price: 1599,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500',
    stock: 35,
    ratings: 4.2,
    numReviews: 43,
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();
    console.log('🗑️  Products cleared');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} products seeded`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@shopvibe.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@shopvibe.com',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('✅ Admin user created: admin@shopvibe.com / Admin@123');
    }

    // Create test user if not exists
    const userExists = await User.findOne({ email: 'user@shopvibe.com' });
    if (!userExists) {
      await User.create({
        name: 'Test User',
        email: 'user@shopvibe.com',
        password: 'User@123',
        role: 'user',
      });
      console.log('✅ Test user created: user@shopvibe.com / User@123');
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDB();
