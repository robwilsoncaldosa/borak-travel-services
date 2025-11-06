# Supabase Migration Guide

This guide will help you migrate from MongoDB to Supabase for the Borak Travel Services application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created
3. Node.js and npm installed

## Step 1: Install Supabase Client

```bash
cd backend
npm install @supabase/supabase-js
```

**Note:** If you're using pnpm (which appears to be the case based on your project), use:
```bash
cd backend
pnpm install @supabase/supabase-js
```

## Step 2: Set Up Supabase Database

### 2.1 Create Tables in Supabase

Go to your Supabase project dashboard → SQL Editor and run the following SQL to create all necessary tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  mobile TEXT NOT NULL,
  nationality TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guest Users table
CREATE TABLE guest_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  firstname TEXT,
  middlename TEXT,
  lastname TEXT,
  mobile TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Packages table
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  duration_hours INTEGER NOT NULL,
  about_tour TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  activities TEXT[] DEFAULT '{}',
  inclusions TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  rating NUMERIC,
  reviews INTEGER,
  max_guests INTEGER,
  itinerary JSONB,
  long_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  package_id TEXT NOT NULL,
  destination TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
  return_date TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_time TEXT,
  return_time TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'INPROGRESS', 'RENDERED')),
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('FULL', 'PARTIAL', 'PENDING', 'REFUNDED')),
  packs INTEGER NOT NULL,
  price NUMERIC,
  paid_amount NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id TEXT NOT NULL,
  package_id TEXT NOT NULL,
  review TEXT NOT NULL,
  rating INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  image_urls TEXT[] DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_package_id ON bookings(package_id);
CREATE INDEX idx_reviews_package_id ON reviews(package_id);
CREATE INDEX idx_reviews_guest_id ON reviews(guest_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
```

### 2.2 Set Up Row Level Security (RLS)

For production, you should enable RLS policies. For development, you can disable RLS temporarily:

```sql
-- Disable RLS for development (enable in production with proper policies)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE guest_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
```

## Step 3: Configure Environment Variables

Add the following to your `backend/.env` file:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
# OR use service role key for admin operations (more permissions)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Remove or comment out MongoDB connection
# DBURL=mongodb://...
```

You can find these values in your Supabase project settings:
- Go to Project Settings → API
- Copy the "Project URL" for `SUPABASE_URL`
- Copy the "anon public" key for `SUPABASE_ANON_KEY`
- Copy the "service_role" key for `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 4: Update Frontend API Calls

The frontend may need updates if it references `_id` instead of `id`. Check the following files:

- `frontend/lib/backend_api/package.ts` - Update `_id` to `id` if needed
- `frontend/lib/backend_api/bookings.ts` - Update `_id` to `id` if needed
- Any other API files that reference MongoDB `_id`

## Step 5: Migrate Data (Optional)

If you have existing MongoDB data, you'll need to export it and import it into Supabase. You can:

1. Export data from MongoDB
2. Transform the data format (change `_id` to `id`, adjust date formats, etc.)
3. Import into Supabase using the SQL Editor or Supabase API

## Step 6: Test the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Verify the connection:
   - Check the console for "Supabase Connected ✅"
   - If you see connection errors, verify your environment variables are set correctly
   - Check that all tables exist in your Supabase dashboard

3. Test API endpoints:
   - Test creating a message (chat functionality)
   - Test creating a booking
   - Test fetching packages
   - Check the backend console for any error messages
   - If you see column name errors, verify the table schema matches the SQL provided

## Step 7: Remove MongoDB Dependencies (Optional)

Once everything is working and tested, you can remove MongoDB:

```bash
cd backend
npm uninstall mongoose
# or if using pnpm:
pnpm remove mongoose
```

**Important:** Only remove mongoose after:
- All functionality has been tested
- You've confirmed Supabase is working correctly
- You've migrated any existing data (if applicable)

## Troubleshooting

### Connection Issues
- Verify your Supabase URL and keys are correct
- Check that your Supabase project is active
- Ensure RLS policies allow your operations (or disable RLS for development)

### Data Type Issues
- Supabase uses UUID for IDs instead of MongoDB ObjectId
- Date fields should be in ISO format
- Arrays in Supabase are stored as PostgreSQL arrays

### Migration Issues
- Ensure all required fields have default values or are provided
- Check that foreign key relationships are maintained
- Verify that enum values match the CHECK constraints

### Column Name Issues
- If you get errors about missing columns, check that the table schema matches the SQL provided
- Remember: database uses `snake_case`, code uses `camelCase`
- The models handle conversion automatically - don't manually convert in controllers
- If you add new columns, update both the SQL schema and the model conversion logic

## Important Notes

### Column Naming Conventions
- **Database columns use snake_case** (e.g., `user_id`, `is_read`, `is_admin`, `image_urls`)
- **Code uses camelCase** (e.g., `userId`, `isRead`, `isAdmin`, `imageUrls`)
- **The models automatically convert** between these formats, so you don't need to worry about it in your controllers
- This is handled transparently in all model operations (create, read, update, delete)

### Code Changes
- The code has been refactored to use Supabase instead of Mongoose
- All models now use Supabase client operations
- IDs are now UUIDs instead of MongoDB ObjectIds
- Timestamps are automatically handled by Supabase
- The frontend may need minor updates to handle `id` instead of `_id`

### Model Conversion
All models (Package, Booking, User, GuestUser, Reviews, Message) automatically handle:
- Converting camelCase to snake_case when writing to Supabase
- Converting snake_case to camelCase when reading from Supabase
- Error logging for better debugging
- Proper null handling and error codes

## Support

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Verify environment variables are set correctly
3. Check that tables are created with correct schemas
4. Review the Supabase documentation: https://supabase.com/docs

