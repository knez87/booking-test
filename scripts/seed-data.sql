-- Clear existing data
TRUNCATE TABLE order_messages, order_items, orders, customers, addons, packages, rooms, venues RESTART IDENTITY CASCADE;

-- Insert sample venues
INSERT INTO venues (name, street, postal_code, city, country, latitude, longitude, summary, language_summary, images, currency, max_delegates, starting_price_cents, facilities, nearby, additionals, sports, package_addon) VALUES
('Helsinki Business Center', 'Mannerheimintie 12', '00100', 'Helsinki', 'Finland', 60.1699, 24.9384, 'Modern business center in the heart of Helsinki with state-of-the-art facilities', '{"en": "Modern business center", "fi": "Moderni liikekeskus"}', '["https://example.com/image1.jpg", "https://example.com/image2.jpg"]', 'EUR', 200, 15000, '["WiFi", "Projector", "Whiteboard", "Coffee machine"]', '["Central Station", "Shopping center", "Restaurants"]', '["Parking", "Reception", "Catering"]', '["Gym", "Sauna"]', true),

('Stockholm Conference Hall', 'Kungsgatan 45', '11156', 'Stockholm', 'Sweden', 59.3293, 18.0686, 'Premium conference facility with panoramic city views', '{"en": "Premium conference facility", "sv": "Premium konferensanläggning"}', '["https://example.com/image3.jpg", "https://example.com/image4.jpg"]', 'SEK', 150, 18000, '["WiFi", "Video conferencing", "Sound system", "Climate control"]', '["Gamla Stan", "Royal Palace", "Museums"]', '["Valet parking", "Concierge", "Fine dining"]', '["Spa", "Pool"]', true),

('Copenhagen Innovation Hub', 'Vesterbrogade 3', '1630', 'Copenhagen', 'Denmark', 55.6761, 12.5683, 'Creative workspace perfect for innovative meetings and workshops', '{"en": "Creative workspace", "da": "Kreativt arbejdsområde"}', '["https://example.com/image5.jpg", "https://example.com/image6.jpg"]', 'DKK', 100, 12000, '["WiFi", "Interactive displays", "Flexible furniture", "Kitchen"]', '["Tivoli Gardens", "City Hall", "Design museums"]', '["Bike rental", "Organic catering", "Event planning"]', '["Yoga studio", "Meditation room"]', true),

('Oslo Waterfront Venue', 'Aker Brygge 1', '0250', 'Oslo', 'Norway', 59.9139, 10.7522, 'Stunning waterfront location with modern amenities', '{"en": "Waterfront location", "no": "Vannkantbeliggenhet"}', '["https://example.com/image7.jpg", "https://example.com/image8.jpg"]', 'NOK', 180, 20000, '["WiFi", "Harbor views", "Outdoor terrace", "Premium AV"]', '["Opera House", "Royal Palace", "Vigeland Park"]', '["Marina access", "Helicopter pad", "Luxury transport"]', '["Sailing", "Kayaking"]', true);

-- Insert sample rooms
INSERT INTO rooms (venue_id, name, min_delegates, max_delegates, instant_bookable, credit_card_required, description, images, equipments, layouts, dimensions) VALUES
-- Helsinki Business Center rooms
(1, 'Executive Boardroom', 8, 20, true, false, 'Premium boardroom with city views and latest technology', '["https://example.com/room1.jpg"]', '["75-inch display", "Conference phone", "Wireless presentation", "Coffee station"]', '["Boardroom: 20", "U-shape: 16", "Classroom: 18"]', '{"length": 8, "width": 6, "height": 3}'),
(1, 'Innovation Lab', 10, 50, true, false, 'Flexible space for workshops and creative sessions', '["https://example.com/room2.jpg"]', '["Interactive whiteboards", "Moveable furniture", "Breakout areas", "Video walls"]', '["Theater: 50", "Classroom: 30", "Cabaret: 40", "Workshop: 25"]', '{"length": 12, "width": 10, "height": 4}'),
(1, 'Sky Lounge', 20, 100, false, true, 'Premium event space with panoramic city views', '["https://example.com/room3.jpg"]', '["Sound system", "Lighting control", "Bar area", "Outdoor terrace"]', '["Reception: 100", "Theater: 80", "Banquet: 60"]', '{"length": 20, "width": 15, "height": 5}'),

-- Stockholm Conference Hall rooms
(2, 'Royal Suite', 12, 30, true, true, 'Luxurious meeting space with traditional Swedish design', '["https://example.com/room4.jpg"]', '["Crystal chandelier", "Antique furniture", "Premium AV", "Butler service"]', '["Boardroom: 30", "U-shape: 24", "Reception: 40"]', '{"length": 10, "width": 8, "height": 4}'),
(2, 'Nordic Hall', 30, 120, false, true, 'Grand hall perfect for large conferences and events', '["https://example.com/room5.jpg"]', '["Stage", "Professional lighting", "Multi-camera setup", "Simultaneous translation"]', '["Theater: 120", "Classroom: 80", "Banquet: 100"]', '{"length": 25, "width": 20, "height": 6}'),

-- Copenhagen Innovation Hub rooms
(3, 'Design Studio', 6, 25, true, false, 'Creative space with Danish design elements', '["https://example.com/room6.jpg"]', '["Design thinking tools", "Sketch walls", "3D printer", "Prototype materials"]', '["Workshop: 25", "Classroom: 20", "Collaboration: 15"]', '{"length": 9, "width": 7, "height": 3.5}'),
(3, 'Hygge Lounge', 15, 60, true, false, 'Cozy Danish-inspired space for informal meetings', '["https://example.com/room7.jpg"]', '["Fireplace", "Comfortable seating", "Acoustic panels", "Organic refreshments"]', '["Lounge: 60", "Theater: 45", "Cabaret: 40"]', '{"length": 15, "width": 12, "height": 4}'),

-- Oslo Waterfront Venue rooms
(4, 'Fjord View', 10, 40, true, true, 'Meeting room with stunning fjord views', '["https://example.com/room8.jpg"]', '["Floor-to-ceiling windows", "Binoculars", "Weather station", "Heated floors"]', '["Boardroom: 40", "U-shape: 30", "Classroom: 35"]', '{"length": 12, "width": 8, "height": 4}'),
(4, 'Aurora Hall', 50, 200, false, true, 'Grand ballroom with northern lights theme', '["https://example.com/room9.jpg"]', '["LED ceiling", "Dance floor", "Full bar", "Professional kitchen"]', '["Theater: 200", "Banquet: 150", "Reception: 250"]', '{"length": 30, "width": 25, "height": 7}');

-- Insert sample packages
INSERT INTO packages (venue_id, name, min_delegates, max_delegates, rooms, info, includes) VALUES
(1, 'Full Day Business Package', 20, 100, '[1, 2]', 'Complete business meeting solution with all amenities', '["Room rental", "Coffee breaks", "Lunch", "AV equipment", "WiFi", "Parking"]'),
(1, 'Executive Retreat', 8, 30, '[1]', 'Premium executive meeting experience', '["Private boardroom", "Gourmet catering", "Dedicated host", "Transportation", "Welcome gifts"]'),
(2, 'Conference Excellence', 30, 120, '[4, 5]', 'Professional conference package with full support', '["Main hall", "Breakout rooms", "Professional AV", "Catering", "Registration desk", "Signage"]'),
(3, 'Innovation Workshop', 15, 50, '[6, 7]', 'Creative workshop package for design thinking', '["Design studio", "Materials", "Facilitator", "Healthy meals", "Documentation", "Follow-up session"]'),
(4, 'Waterfront Gala', 50, 200, '[8, 9]', 'Luxury event package with waterfront views', '["Grand ballroom", "Premium catering", "Entertainment", "Photography", "Flowers", "Valet service"]');

-- Insert sample addons
INSERT INTO addons (venue_id, description, category, currency, amount, amount_inc_tax, unit, available_rooms, package_addon, available_packages) VALUES
-- Helsinki Business Center addons
(1, 'Premium coffee and pastries', 'Catering', 'EUR', 15.00, 18.00, 'per person', '[1, 2, 3]', false, '[1, 2]'),
(1, 'Wireless presentation system', 'Technology', 'EUR', 50.00, 60.00, 'per day', '[1, 2]', false, '[1, 2]'),
(1, 'Professional photographer', 'Services', 'EUR', 200.00, 240.00, 'per hour', '[1, 2, 3]', true, '[1, 2]'),
(1, 'Simultaneous translation', 'Services', 'EUR', 150.00, 180.00, 'per language per day', '[2, 3]', true, '[1]'),

-- Stockholm Conference Hall addons
(2, 'Gourmet lunch buffet', 'Catering', 'SEK', 180.00, 225.00, 'per person', '[4, 5]', false, '[3]'),
(2, 'Live streaming setup', 'Technology', 'SEK', 800.00, 1000.00, 'per day', '[5]', true, '[3]'),
(2, 'Welcome reception', 'Catering', 'SEK', 120.00, 150.00, 'per person', '[4, 5]', true, '[3]'),

-- Copenhagen Innovation Hub addons
(3, 'Organic lunch boxes', 'Catering', 'DKK', 85.00, 106.25, 'per person', '[6, 7]', false, '[4]'),
(3, 'Design thinking facilitator', 'Services', 'DKK', 1200.00, 1500.00, 'per day', '[6]', true, '[4]'),
(3, 'Prototype materials kit', 'Materials', 'DKK', 200.00, 250.00, 'per kit', '[6]', false, '[4]'),

-- Oslo Waterfront Venue addons
(4, 'Champagne welcome', 'Catering', 'NOK', 95.00, 118.75, 'per person', '[8, 9]', true, '[5]'),
(4, 'Harbor cruise', 'Entertainment', 'NOK', 350.00, 437.50, 'per person', '[8, 9]', true, '[5]'),
(4, 'Professional DJ', 'Entertainment', 'NOK', 2000.00, 2500.00, 'per event', '[9]', true, '[5]');

-- Insert sample customers
INSERT INTO customers (first_name, last_name, email, company, phone, billing_address) VALUES
('John', 'Doe', 'john.doe@techcorp.com', 'TechCorp Solutions', '+358401234567', '{"street": "Teollisuuskatu 15", "postal_code": "00510", "city": "Helsinki", "country": "Finland"}'),
('Sarah', 'Johnson', 'sarah.johnson@innovate.se', 'Innovate Stockholm AB', '+46701234567', '{"street": "Drottninggatan 88", "postal_code": "11136", "city": "Stockholm", "country": "Sweden"}'),
('Lars', 'Nielsen', 'lars.nielsen@designco.dk', 'DesignCo Copenhagen', '+4520123456', '{"street": "Nørrebrogade 52", "postal_code": "2200", "city": "Copenhagen", "country": "Denmark"}'),
('Emma', 'Andersen', 'emma.andersen@fjordtech.no', 'Fjord Technologies', '+4798765432', '{"street": "Karl Johans gate 22", "postal_code": "0159", "city": "Oslo", "country": "Norway"}'),
('Michael', 'Brown', 'michael.brown@globalevents.com', 'Global Events Ltd', '+44207123456', '{"street": "Baker Street 221B", "postal_code": "NW1 6XE", "city": "London", "country": "United Kingdom"}');

-- Insert sample orders
INSERT INTO orders (availability_id, customer_id, booking_reference, status, layout, room_id, additional_notes, host_name, event_name, discount_code, currency, amount_inc_tax, start_date, end_date, delegates) VALUES
('room_1_1640995200000', 1, 'BK2024001', 'confirmed', 'Boardroom', 1, 'Please prepare coffee for arrival at 9 AM', 'John Doe', 'Q1 Strategy Meeting', null, 'EUR', 540.00, '2024-03-15 09:00:00', '2024-03-15 17:00:00', 15),
('room_4_1640995300000', 2, 'BK2024002', 'pending', 'U-shape', 4, 'VIP treatment required', 'Sarah Johnson', 'Board Meeting', 'VIP10', 'SEK', 2250.00, '2024-03-20 10:00:00', '2024-03-20 16:00:00', 25),
('room_6_1640995400000', 3, 'BK2024003', 'confirmed', 'Workshop', 6, 'Need extra design materials', 'Lars Nielsen', 'Design Sprint Workshop', null, 'DKK', 1875.00, '2024-03-25 09:00:00', '2024-03-27 17:00:00', 20),
('room_8_1640995500000', 4, 'BK2024004', 'confirmed', 'Boardroom', 8, 'Dietary restrictions: 2 vegetarian, 1 gluten-free', 'Emma Andersen', 'Product Launch Planning', null, 'NOK', 3125.00, '2024-04-01 08:00:00', '2024-04-01 18:00  'Product Launch Planning', null, 'NOK', 3125.00, '2024-04-01 08:00:00', '2024-04-01 18:00:00', 30),
('room_9_1640995600000', 5, 'BK2024005', 'pending', 'Theater', 9, 'Need professional lighting setup for presentation', 'Michael Brown', 'Annual Conference 2024', 'EARLY20', 'NOK', 12500.00, '2024-04-10 09:00:00', '2024-04-12 17:00:00', 150);

-- Insert sample order items
INSERT INTO order_items (order_id, addon_id, name, product, quantity, unit, unit_price, unit_price_inc_tax, amount, amount_inc_tax, is_package_content) VALUES
-- Order 1 items (Helsinki - Executive Boardroom)
(1, 1, 'Premium coffee and pastries', 'Catering', 15, 'per person', 15.00, 18.00, 225.00, 270.00, false),
(1, 2, 'Wireless presentation system', 'Technology', 1, 'per day', 50.00, 60.00, 50.00, 60.00, false),
(1, 3, 'Professional photographer', 'Services', 2, 'per hour', 200.00, 240.00, 400.00, 480.00, false),

-- Order 2 items (Stockholm - Royal Suite)
(2, 5, 'Gourmet lunch buffet', 'Catering', 25, 'per person', 180.00, 225.00, 4500.00, 5625.00, false),
(2, 7, 'Welcome reception', 'Catering', 25, 'per person', 120.00, 150.00, 3000.00, 3750.00, true),

-- Order 3 items (Copenhagen - Design Studio)
(3, 8, 'Organic lunch boxes', 'Catering', 20, 'per person', 85.00, 106.25, 1700.00, 2125.00, false),
(3, 9, 'Design thinking facilitator', 'Services', 3, 'per day', 1200.00, 1500.00, 3600.00, 4500.00, true),
(3, 10, 'Prototype materials kit', 'Materials', 5, 'per kit', 200.00, 250.00, 1000.00, 1250.00, false),

-- Order 4 items (Oslo - Fjord View)
(4, 11, 'Champagne welcome', 'Catering', 30, 'per person', 95.00, 118.75, 2850.00, 3562.50, true),
(4, 12, 'Harbor cruise', 'Entertainment', 30, 'per person', 350.00, 437.50, 10500.00, 13125.00, true),

-- Order 5 items (Oslo - Aurora Hall)
(5, 11, 'Champagne welcome', 'Catering', 150, 'per person', 95.00, 118.75, 14250.00, 17812.50, true),
(5, 13, 'Professional DJ', 'Entertainment', 1, 'per event', 2000.00, 2500.00, 2000.00, 2500.00, true);

-- Insert sample order messages
INSERT INTO order_messages (order_id, message, sender, created_at) VALUES
(1, 'Booking confirmed! Looking forward to hosting your Q1 Strategy Meeting.', 'venue', '2024-02-15 10:30:00'),
(1, 'Thank you! Can we confirm the coffee will be ready by 9 AM sharp?', 'customer', '2024-02-15 11:15:00'),
(1, 'Coffee and pastries will be set up by 8:45 AM.', 'venue', '2024-02-15 11:20:00'),
(1, 'Perfect! We also need the photographer to focus on the presentation slides.', 'customer', '2024-02-16 09:00:00'),

(2, 'Your booking is pending final approval. We will confirm within 24 hours.', 'venue', '2024-02-20 14:00:00'),
(2, 'Please expedite - this is for our board of directors.', 'customer', '2024-02-20 14:30:00'),
(2, 'Understood. Booking confirmed with VIP treatment as requested.', 'venue', '2024-02-20 15:00:00'),

(3, 'Design Sprint Workshop confirmed! Extra materials have been arranged.', 'venue', '2024-02-25 16:00:00'),
(3, 'Excellent! Will the facilitator be available for the full 3 days?', 'customer', '2024-02-25 16:30:00'),
(3, 'Yes, our senior design facilitator will be with you all three days.', 'venue', '2024-02-25 17:00:00'),

(4, 'Product Launch Planning confirmed. Dietary requirements noted.', 'venue', '2024-03-01 12:00:00'),
(4, 'Great! The harbor cruise timing - can we do it during lunch break?', 'customer', '2024-03-01 13:00:00'),
(4, 'Perfect timing! Harbor cruise scheduled for 12:00-14:00.', 'venue', '2024-03-01 13:15:00'),

(5, 'Large conference booking pending - checking availability of all resources.', 'venue', '2024-03-10 10:00:00'),
(5, 'This is our biggest event of the year. Please confirm ASAP.', 'customer', '2024-03-10 11:00:00');

-- Update order totals based on items
UPDATE orders SET amount_inc_tax = (
  SELECT COALESCE(SUM(amount_inc_tax), 0) 
  FROM order_items 
  WHERE order_id = orders.id
) + 
CASE 
  WHEN id = 1 THEN 540.00  -- Room base price
  WHEN id = 2 THEN 2250.00 -- Room base price
  WHEN id = 3 THEN 1875.00 -- Room base price
  WHEN id = 4 THEN 3125.00 -- Room base price
  WHEN id = 5 THEN 12500.00 -- Room base price
  ELSE 0
END;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_venues_location ON venues USING GIST (ll_to_earth(CAST(latitude AS FLOAT), CAST(longitude AS FLOAT)));
CREATE INDEX IF NOT EXISTS idx_orders_dates ON orders (start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_orders_status_room ON orders (status, room_id);
CREATE INDEX IF NOT EXISTS idx_customers_email_lower ON customers (LOWER(email));

-- Add some statistics
ANALYZE venues;
ANALYZE rooms;
ANALYZE packages;
ANALYZE addons;
ANALYZE customers;
ANALYZE orders;
ANALYZE order_items;
ANALYZE order_messages;
