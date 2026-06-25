-- Clean up existing data to avoid constraint violations during re-seeding
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE test_questions;
TRUNCATE TABLE test_attempts;
TRUNCATE TABLE bookmarks;
TRUNCATE TABLE tests;
TRUNCATE TABLE questions;
TRUNCATE TABLE categories;
TRUNCATE TABLE formulas;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Seed Categories
INSERT INTO categories (id, name) VALUES 
(1, 'Quantitative'),
(2, 'Logical Reasoning'),
(3, 'Verbal');

-- Seed Users (Password is 'password' for both)
INSERT INTO users (id, username, email, password, role) VALUES
(1, 'user', 'user@gmail.com', '$2a$10$4N90CpRaVXOU1WUm.Yj9D.ViS968oj.pvkVJ91bEje7.hBdHBdh8e', 'USER'),
(2, 'admin', 'admin@gmail.com', '$2a$10$4N90CpRaVXOU1WUm.Yj9D.ViS968oj.pvkVJ91bEje7.hBdHBdh8e', 'ADMIN');

-- Seed Questions (with detailed step-by-step explanations)
INSERT INTO questions (id, text, category_id, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
(1, 'If a car travels 120 km in 2 hours, what is its average speed in km/h?', 1, '40 km/h', '50 km/h', '60 km/h', '80 km/h', '60 km/h', 'Speed = Distance / Time. Distance = 120 km, Time = 2 hours. Speed = 120 / 2 = 60 km/h.'),
(2, 'What is 15% of 200?', 1, '20', '25', '30', '35', '30', '15% of 200 = (15 / 100) * 200 = 15 * 2 = 30.'),
(3, 'A sum of money doubles itself in 5 years at simple interest. What is the annual rate of interest?', 1, '10%', '15%', '20%', '25%', '20%', 'Let Principal be P. Amount after 5 years = 2P. Simple Interest (SI) = Amount - Principal = 2P - P = P. We know SI = (P * R * T) / 100. So, P = (P * R * 5) / 100 => 1 = 5R / 100 => R = 100 / 5 = 20%.'),
(4, 'Complete the series: 2, 6, 12, 20, 30, ?', 2, '36', '40', '42', '46', '42', 'The difference between consecutive terms is: 6-2=4, 12-6=6, 20-12=8, 30-20=10. The differences are 4, 6, 8, 10... which increases by 2. The next difference should be 12. So, the next term is 30 + 12 = 42.'),
(5, 'Light is to Darkness as Knowledge is to ?', 2, 'Ignorance', 'Intelligence', 'Books', 'School', 'Ignorance', 'Light is the opposite of Darkness. Similarly, Knowledge is the opposite of Ignorance.'),
(6, 'If COLD is coded as DPME, how is WARM coded?', 2, 'XBSN', 'XBTN', 'YCSN', 'YCTN', 'XBSN', 'Each letter is shifted to the next letter in the alphabet: C -> D, O -> P, L -> M, D -> E. Applying the same logic to WARM: W -> X, A -> B, R -> S, M -> N. Thus, WARM is coded as XBSN.'),
(7, 'Choose the word that is most opposite in meaning to "GENEROUS".', 3, 'Kind', 'Stingy', 'Charitable', 'Noble', 'Stingy', 'Generous means willing to give money, help, etc. Stingy means unwilling to spend or give money. So Stingy is the opposite of Generous.'),
(8, 'Identify the synonym of "COMPASSIONATE".', 3, 'Cruel', 'Unsympathetic', 'Empathetic', 'Indifferent', 'Empathetic', 'Compassionate means feeling or showing sympathy and concern for others. Empathetic has a similar meaning of sharing and understanding others feelings.'),
(9, 'Fill in the blank: She has been working here _______ 2018.', 3, 'for', 'since', 'from', 'in', 'since', '"Since" is used to refer to a specific point in time in the past when the action started (2018).');

-- Seed a default Test
INSERT INTO tests (id, name, description, duration, category_id) VALUES
(1, 'General Aptitude Test 1', 'A mixed test covering Quantitative, Logical Reasoning, and Verbal sections to evaluate basic aptitude.', 10, NULL);

-- Link Questions to Test
INSERT INTO test_questions (test_id, question_id) VALUES
(1, 1),
(1, 2),
(1, 4),
(1, 5),
(1, 7),
(1, 8);

-- Seed Formulas / Revision Notes
INSERT INTO formulas (id, title, content, category) VALUES
(1, 'Speed, Distance & Time Formulas', '### Speed, Distance & Time\n- **Speed = Distance / Time** (S = D/T)\n- **Distance = Speed * Time** (D = S*T)\n- **Time = Distance / Speed** (T = D/S)\n\n#### Conversions\n- **km/h to m/s**: Multiply by 5/18 (e.g., 36 km/h = 36 * 5/18 = 10 m/s)\n- **m/s to km/h**: Multiply by 18/5 (e.g., 20 m/s = 20 * 18/5 = 72 km/h)\n\n#### Average Speed\n- When a person travels equal distances at speeds of **x** km/h and **y** km/h:\n  **Average Speed = 2xy / (x + y)**', 'Quantitative'),

(2, 'Percentage Shortcuts', '### Percentage Basics\n- **x% of y = (x / 100) * y**\n- **To express x as a percentage of y**: (x / y) * 100\n\n#### Important Conversions\n- 1/2 = 50%\n- 1/3 = 33.33%\n- 1/4 = 25%\n- 1/5 = 20%\n- 1/6 = 16.66%\n- 1/8 = 12.5%\n- 1/10 = 10%\n\n#### Percentage Increase / Decrease\n- **% Increase** = (New Value - Old Value) / Old Value * 100\n- **% Decrease** = (Old Value - New Value) / Old Value * 100', 'Quantitative'),

(3, 'Coding-Decoding Tricks', '### Alphabet Positions (EJOTY)\nUse the word **E-J-O-T-Y** to remember the positions of letters:\n- **E** = 5\n- **J** = 10\n- **O** = 15\n- **T** = 20\n- **Y** = 25\n\n#### Opposite Letters (Pairs summing to 27)\n- A (1) <-> Z (26)\n- B (2) <-> Y (25)\n- C (3) <-> X (24)\n- G (7) <-> T (20) [G-T Road]\n- H (8) <-> S (19) [High School]', 'Logical Reasoning');