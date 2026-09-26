CREATE TABLE IF NOT EXISTS culinary_techniques (id TEXT PRIMARY KEY, payload TEXT NOT NULL CHECK(json_valid(payload)));
CREATE TABLE IF NOT EXISTS culinary_tips (id TEXT PRIMARY KEY, payload TEXT NOT NULL CHECK(json_valid(payload)));
CREATE TABLE IF NOT EXISTS tip_reviews (
 user_id TEXT NOT NULL,
 tip_id TEXT NOT NULL REFERENCES culinary_tips(id),
 state TEXT NOT NULL CHECK(state IN ('keep','hide','pending')),
 updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 PRIMARY KEY(user_id,tip_id)
);
