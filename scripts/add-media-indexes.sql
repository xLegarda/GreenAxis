-- Database indexes for media library performance optimization
-- Execute these commands in your Turso database shell

-- Index for category filtering with updated date sorting (most common query)
CREATE INDEX IF NOT EXISTS idx_siteimage_category_updated ON SiteImage(category, updatedAt);

-- Index for label search (used in media picker search)
CREATE INDEX IF NOT EXISTS idx_siteimage_label ON SiteImage(label);

-- Index for category filtering alone
CREATE INDEX IF NOT EXISTS idx_siteimage_category ON SiteImage(category);

-- Index for date sorting (used in default ordering)
CREATE INDEX IF NOT EXISTS idx_siteimage_updated ON SiteImage(updatedAt);

-- Index for hash-based duplicate detection
CREATE INDEX IF NOT EXISTS idx_siteimage_hash ON SiteImage(hash);

-- Verify indexes were created
.indexes SiteImage