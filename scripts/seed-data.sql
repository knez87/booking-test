-- Seed data for the booking journey application

-- Insert sample venues
INSERT INTO venues (name, street, postal_code, city, country, latitude, longitude, summary, language_summary, images, currency, max_delegates, starting_price_cents, facilities, nearby, additionals, sports, package_addon) VALUES
('Helsinki Business Center', 'Mannerheimintie 12', '00100', 'Helsinki', 'Finland', 60.1699, 24.9384, 'Modern business center in the heart of Helsinki', 'Moderni liikekeskus Helsingin sydämessä', '[{"url": "/placeholder.svg?height=300&width=400"}]', 'EUR', 200, 15000, '[{"id": 1, "facility_description": "WiFi", "localized_description": "Langaton internet"}]', '[{"id": 1, "description": "Central Railway Station", "description_localized": "Rautatieasema"}]', '[{"id": 1, "description": "Catering", "description_localized": "Catering-palvelut"}]', '[{"id": 1, "description": "Gym", "description_localized": "Kuntosali"}]', true),
('Stockholm Conference Hall', 'Kungsgatan 45', '11156', 'Stockholm', 'Sweden', 59.3293, 18.0686, 'Premium conference facility in Stockholm city center', 'Premium konferenslokaler i Stockholms centrum', '[{"url": "/placeholder.svg?height=300&width=400"}]', 'SEK', 150, 18000, '[{"id": 1, "facility_description": "WiFi", "localized_description": "Trådlöst internet"}]', '[{"id": 1, "description": "Central Station", "description_localized": "Centralstation"}]', '[{"id": 1, "description": "Catering", "description_localized": "Catering"}]', '[{"id": 1, "description": "Fitness Center", "description_localized": "Gym"}]', true),
('Copenhagen Meeting Spaces', 'Strøget 25', '1160', 'Copenhagen', 'Denmark', 55.6761, 12.5683, 'Elegant meeting spaces in Copenhagen', 'Elegante mødelokaler i København', '[{"url": "/placeholder.svg?height=300&width=400"}]', 'DKK', 100, 12000, '[{"id": 1, "facility_description": "WiFi", "localized_description": "Trådløst internet"}]', '[{"id": 1, "description": "City Hall", "description_localized": "Rådhus"}]', '[{"id": 1, "description": "Catering", "description_localized": "Catering"}]', '[{"id": 1, "description": "Wellness", "description_localized": "Wellness"}]', true);

-- Insert sample rooms
INSERT INTO rooms (name, venue_id, min_delegates, max_delegates, instant_bookable, credit_card_required, description, images, equipments, layouts, dimensions) VALUES
('Executive Boardroom', 1, 8, 20, true, false, 'Premium boardroom with city views', '[{"url": "/placeholder.svg?height=200&width=300"}]', '[{"id": 1, "description": "Projector", "description_localized": "Projektori", "free": true}]', '[{"name": "Boardroom", "max_delegates": 20}]', '{"area": "45", "width": "6", "height": "3", "length": "7.5", "unit": "m"}'),
('Conference Room A', 1, 10, 50, true, false, 'Large conference room for presentations', '[{"url": "/placeholder.svg?height=200&width=300"}]', '[{"id": 1, "description": "Projector", "description_localized": "Projektori", "free": true}, {"id": 2, "description": "Sound System", "description_localized": "Äänijärjestelmä", "free": true}]', '[{"name": "Theater", "max_delegates": 50}, {"name": "U-Shape", "max_delegates": 30}]', '{"area": "80", "width": "8", "height": "3", "length": "10", "unit": "m"}'),
('Meeting Room B', 1, 4, 12, true, false, 'Intimate meeting space', '[{"url": "/placeholder.svg?height=200&width=300"}]', '[{"id": 1, "description": "TV Screen", "description_localized": "TV-näyttö", "free": true}]', '[{"name": "Boardroom", "max_delegates": 12}]', '{"area": "25", "width": "5", "height": "3", "length": "5", "unit": "m"}'),
('Stockholm Main Hall', 2, 20, 150, true, true, 'Grand conference hall with premium amenities', '[{"url": "/placeholder.svg?height=200&width=300"}]', '[{"id": 1, "description": "Professional AV System", "description_localized": "Professionellt AV-system", "free": false}]', '[{"name": "Theater", "max_delegates": 150}, {"name": "Banquet", "max_delegates": 100}]', '{"area": "200", "width": "15", "height": "4", "length": "13", "unit": "m"}'),
('Copenhagen Lounge', 3, 6, 25, true, false, 'Stylish lounge for informal meetings', '[{"url": "/placeholder.svg?height=200&width=300"}]', '[{"id": 1, "description": "WiFi", "description_localized": "Trådløst internet", "free": true}]', '[{"name": "Lounge", "max_delegates": 25}]', '{"area": "60", "width": "8", "height": "3", "length": "7.5", "unit": "m"}');

-- Insert sample packages
INSERT INTO packages (venue_id, name, min_delegates, max_delegates, rooms, info, includes) VALUES
(1, 'Full Day Business Package', 10, 50, '[1, 2]', 'Complete business meeting package', '[{"id": 1, "description": "Coffee breaks"}, {"id": 2, "description": "Lunch"}, {"id": 3, "description": "AV equipment"}]'),
(1, 'Half Day Meeting Package', 5, 20, '[1, 3]', 'Perfect for shorter meetings', '[{"id": 1, "description": "Coffee break"}, {"id": 2, "description": "AV equipment"}]'),
(2, 'Premium Conference Package', 20, 150, '[4]', 'Premium conference experience', '[{"id": 1, "description": "Welcome coffee"}, {"id": 2, "description": "Lunch"}, {"id": 3, "description": "Afternoon break"}, {"id": 4, "description": "Professional AV"}]'),
(3, 'Casual Meeting Package', 6, 25, '[5]', 'Relaxed meeting environment', '[{"id": 1, "description": "Coffee"}, {"id": 2, "description": "Light refreshments"}]');

-- Insert sample addons
INSERT INTO addons (venue_id, description, category, currency, amount, amount_inc_tax, unit, available_rooms, package_addon, available_packages) VALUES
(1, 'Professional Catering Service', 'Catering', 'EUR', 25.00, 30.00, 'per person', '[1, 2, 3]', true, '["1", "2"]'),
(1, 'AV Equipment Rental', 'Technology', 'EUR', 150.00, 180.00, 'per day', '[1, 2, 3]', false, '[]'),
(1, 'Flip Chart and Markers', 'Stationery', 'EUR', 15.00, 18.00, 'per set', '[1, 2, 3]', true, '["1", "2"]'),
(2, 'Gourmet Lunch Package', 'Catering', 'SEK', 280.00, 350.00, 'per person', '[4]', true, '["3"]'),
(2, 'Professional Photography', 'Services', 'SEK', 2000.00, 2500.00, 'per event', '[4]', false, '[]'),
(3, 'Danish Pastry Selection', 'Catering', 'DKK', 85.00, 106.25, 'per person', '[5]', true, '["4"]'),
(3, 'Translation Services', 'Services', 'DKK', 800.00, 1000.00, 'per hour', '[5]', false, '[]');

-- Insert sample customers
INSERT INTO customers (first_name, last_name, email, company, phone, billing_address) VALUES
('John', 'Doe', 'john.doe@example.com', 'Tech Solutions Ltd', '+358401234567', '{"street": "Aleksanterinkatu 1", "postal_code": "00100", "city": "Helsinki", "country": "Finland", "country_code": "FI", "state": "Uusimaa"}'),
('Jane', 'Smith', 'jane.smith@company.com', 'Nordic Enterprises', '+46701234567', '{"street": "Drottninggatan 10", "postal_code": "11151", "city": "Stockholm", "country": "Sweden", "country_code": "SE"}'),
('Lars', 'Nielsen', 'lars.nielsen@business.dk', 'Copenhagen Business Group', '+4520123456', '{"street": "Nyhavn 12", "postal_code": "1051", "city": "Copenhagen", "country": "Denmark", "country_code": "DK"}');

-- Insert sample orders
INSERT INTO orders (availability_id, customer_id, booking_reference, status, layout, room_id, additional_notes, host_name, event_name, currency, amount_inc_tax, start_date, end_date, delegates, rooms) VALUES
('room_1_1640995200000', '1', 'BK2024001', 'confirmed', 'Boardroom', 1, 'Please prepare coffee for arrival', 'John Doe', 'Q4 Strategy Meeting', 'EUR', 450.00, '2024-02-15 09:00:00', '2024-02-15 17:00:00', 15, '[{"name": "Executive Boardroom", "layout": "Boardroom"}]'),
('package_1_1640995200001', '2', 'BK2024002', 'pending', 'Theater', 2, 'Dietary requirements: 2 vegetarian meals', 'Jane Smith', 'Product Launch Event', 'EUR', 1250.00, '2024-02-20 08:00:00', '2024-02-20 18:00:00', 35, '[{"name": "Conference Room A", "layout": "Theater"}]'),
('room_4_1640995200002', '3', 'BK2024003', 'confirmed', 'Theater', 4, 'VIP setup required', 'Lars Nielsen', 'Annual Conference', 'SEK', 5500.00, '2024-03-01 08:00:00', '2024-03-01 17:00:00', 120, '[{"name": "Stockholm Main Hall", "layout": "Theater"}]');

-- Insert sample order items
INSERT INTO order_items (order_id, addon_id, name, product, quantity, unit, unit_price, unit_price_inc_tax, amount, amount_inc_tax, is_package_content) VALUES
(1, 1, 'Professional Catering Service', 'Catering', 15, 'per person', 25.00, 30.00, 375.00, 450.00, false),
(1, 3, 'Flip Chart and Markers', 'Stationery', 2, 'per set', 15.00, 18.00, 30.00, 36.00, false),
(2, 1, 'Professional Catering Service', 'Catering', 35, 'per person', 25.00, 30.00, 875.00, 1050.00, true),
(2, 2, 'AV Equipment Rental', 'Technology', 1, 'per day', 150.00, 180.00, 150.00, 180.00, true),
(3, 4, 'Gourmet Lunch Package', 'Catering', 120, 'per person', 280.00, 350.00, 33600.00, 42000.00, true),
(3, 5, 'Professional Photography', 'Services', 1, 'per event', 2000.00, 2500.00, 2000.00, 2500.00, false);

-- Insert sample order messages
INSERT INTO order_messages (order_id, message, sender) VALUES
(1, 'Order confirmed. Room setup will be ready by 8:30 AM.', 'venue_manager'),
(1, 'Thank you for the confirmation. Looking forward to the event.', 'customer'),
(2, 'Please confirm dietary requirements for catering.', 'venue_manager'),
(2, 'We need 2 vegetarian and 1 vegan meal option.', 'customer'),
(2, 'Dietary requirements noted and confirmed with catering team.', 'venue_manager'),
(3, 'VIP setup includes premium seating and dedicated service staff.', 'venue_manager'),
(3, 'Perfect! Please also arrange for welcome drinks.', 'customer');
