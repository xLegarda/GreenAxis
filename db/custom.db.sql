BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "AboutPage" (
	"id"	TEXT NOT NULL,
	"heroTitle"	TEXT DEFAULT 'Quiénes Somos',
	"heroSubtitle"	TEXT DEFAULT 'Comprometidos con el medio ambiente',
	"heroImageUrl"	TEXT,
	"historyTitle"	TEXT DEFAULT 'Nuestra Historia',
	"historyContent"	TEXT,
	"historyImageUrl"	TEXT,
	"missionTitle"	TEXT DEFAULT 'Nuestra Misión',
	"missionContent"	TEXT,
	"visionTitle"	TEXT DEFAULT 'Nuestra Visión',
	"visionContent"	TEXT,
	"valuesTitle"	TEXT DEFAULT 'Nuestros Valores',
	"valuesContent"	TEXT,
	"teamTitle"	TEXT DEFAULT 'Nuestro Equipo',
	"teamEnabled"	BOOLEAN NOT NULL DEFAULT false,
	"teamMembers"	TEXT,
	"whyChooseTitle"	TEXT DEFAULT '¿Por Qué Elegirnos?',
	"whyChooseContent"	TEXT,
	"ctaTitle"	TEXT DEFAULT '¿Listo para trabajar con nosotros?',
	"ctaSubtitle"	TEXT DEFAULT 'Contáctanos y descubre cómo podemos ayudarte',
	"ctaButtonText"	TEXT DEFAULT 'Contáctanos',
	"ctaButtonUrl"	TEXT DEFAULT '/contacto',
	"statsEnabled"	BOOLEAN NOT NULL DEFAULT true,
	"statsContent"	TEXT,
	"certificationsEnabled"	BOOLEAN NOT NULL DEFAULT false,
	"certificationsContent"	TEXT,
	"showLocationSection"	BOOLEAN NOT NULL DEFAULT true,
	"createdAt"	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME NOT NULL,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "Admin" (
	"id"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	"name"	TEXT,
	"role"	TEXT NOT NULL DEFAULT 'admin',
	"status"	TEXT NOT NULL DEFAULT 'pendiente',
	"createdAt"	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME NOT NULL,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "CarouselSlide" (
	"id"	TEXT NOT NULL,
	"title"	TEXT,
	"subtitle"	TEXT,
	"description"	TEXT,
	"imageUrl"	TEXT NOT NULL,
	"buttonText"	TEXT,
	"buttonUrl"	TEXT,
	"linkUrl"	TEXT,
	"gradientEnabled"	BOOLEAN NOT NULL DEFAULT true,
	"animationEnabled"	BOOLEAN NOT NULL DEFAULT true,
	"gradientColor"	TEXT,
	"order"	INTEGER NOT NULL DEFAULT 0,
	"active"	BOOLEAN NOT NULL DEFAULT true,
	"createdAt"	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME NOT NULL,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "ContactMessage" (
	"id"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
	"phone"	TEXT,
	"company"	TEXT,
	"subject"	TEXT,
	"message"	TEXT NOT NULL,
	"consent"	BOOLEAN NOT NULL DEFAULT false,
	"read"	BOOLEAN NOT NULL DEFAULT false,
	"createdAt"	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "LegalPage" (
	"id"	TEXT NOT NULL,
	"slug"	TEXT NOT NULL,
	"title"	TEXT NOT NULL,
	"content"	TEXT NOT NULL,
	"blocks"	TEXT,
	"manualDate"	TEXT,
	"updatedAt"	DATETIME NOT NULL,
	"createdAt"	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "News" (
	"id"	TEXT NOT NULL,
	"title"	TEXT NOT NULL,
	"slug"	TEXT NOT NULL,
	"excerpt"	TEXT,
	"content"	TEXT NOT NULL,
	"imageUrl"	TEXT,
	"author"	TEXT,
	"published"	BOOLEAN NOT NULL DEFAULT false,
	"featured"	BOOLEAN NOT NULL DEFAULT false,
	"publishedAt"	DATETIME,
	"blocks"	TEXT,
	"showCoverInContent"	BOOLEAN NOT NULL DEFAULT true,
	"imageCaption"	TEXT,
	"createdAt"	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME NOT NULL,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
	"id"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
	"token"	TEXT NOT NULL,
	"expiresAt"	DATETIME NOT NULL,
	"used"	BOOLEAN NOT NULL DEFAULT false,
	"createdAt"	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "PlatformConfig" (
	"id"	TEXT NOT NULL,
	"siteName"	TEXT NOT NULL DEFAULT 'Green Axis S.A.S.',
	"siteUrl"	TEXT,
	"siteSlogan"	TEXT,
	"siteDescription"	TEXT,
	"logoUrl"	TEXT,
	"faviconUrl"	TEXT,
	"companyName"	TEXT,
	"companyAddress"	TEXT,
	"companyPhone"	TEXT,
	"companyEmail"	TEXT,
	"notificationEmail"	TEXT,
	"facebookUrl"	TEXT,
	"instagramUrl"	TEXT,
	"twitterUrl"	TEXT,
	"linkedinUrl"	TEXT,
	"tiktokUrl"	TEXT,
	"youtubeUrl"	TEXT,
	"footerText"	TEXT,
	"socialText"	TEXT DEFAULT 'Síguenos en nuestras redes',
	"whatsappNumber"	TEXT,
	"whatsappMessage"	TEXT DEFAULT '¡Hola! Me gustaría obtener información sobre sus servicios ambientales.',
	"whatsappShowBubble"	BOOLEAN NOT NULL DEFAULT true,
	"aboutImageUrl"	TEXT,
	"aboutTitle"	TEXT DEFAULT 'Comprometidos con el futuro del planeta',
	"aboutDescription"	TEXT,
	"aboutYearsExperience"	TEXT DEFAULT '15',
	"aboutYearsText"	TEXT DEFAULT 'Años protegiendo el medio ambiente',
	"aboutStats"	TEXT,
	"aboutFeatures"	TEXT,
	"aboutSectionEnabled"	BOOLEAN NOT NULL DEFAULT true,
	"aboutBadge"	TEXT DEFAULT 'Sobre Nosotros',
	"aboutBadgeColor"	TEXT DEFAULT '#6BBE45',
	"showMapSection"	BOOLEAN NOT NULL DEFAULT true,
	"metaKeywords"	TEXT,
	"googleAnalytics"	TEXT,
	"googleMapsEmbed"	TEXT,
	"primaryColor"	TEXT DEFAULT '#6BBE45',
	"createdAt"	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME NOT NULL,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "Service" (
	"id"	TEXT NOT NULL,
	"title"	TEXT NOT NULL,
	"description"	TEXT,
	"content"	TEXT,
	"icon"	TEXT,
	"imageUrl"	TEXT,
	"order"	INTEGER NOT NULL DEFAULT 0,
	"active"	BOOLEAN NOT NULL DEFAULT true,
	"featured"	BOOLEAN NOT NULL DEFAULT false,
	"createdAt"	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME NOT NULL,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "SiteImage" (
	"id"	TEXT NOT NULL,
	"key"	TEXT NOT NULL,
	"label"	TEXT NOT NULL,
	"url"	TEXT NOT NULL,
	"alt"	TEXT,
	"category"	TEXT,
	"fileSize"	INTEGER,
	"mimeType"	TEXT,
	"createdAt"	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "SocialFeedConfig" (
	"id"	TEXT NOT NULL,
	"platform"	TEXT NOT NULL,
	"embedCode"	TEXT,
	"accessToken"	TEXT,
	"pageId"	TEXT,
	"active"	BOOLEAN NOT NULL DEFAULT true,
	"createdAt"	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME NOT NULL,
	PRIMARY KEY("id")
);
INSERT INTO "PlatformConfig" VALUES ('cmmmop78t000hp7ultps0fe6q','Green Axis S.A.S.',NULL,'Comprometidos con el medio ambiente','Empresa líder en servicios ambientales en Colombia',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Síguenos en nuestras redes',NULL,'¡Hola! Me gustaría obtener información sobre sus servicios ambientales.',1,NULL,'Comprometidos con el futuro del planeta',NULL,'15','Años protegiendo el medio ambiente',NULL,NULL,1,'Sobre Nosotros','#6BBE45',1,NULL,NULL,NULL,'#6BBE45',1773272563950,1773272563950);
CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin" (
	"email"
);
CREATE UNIQUE INDEX IF NOT EXISTS "LegalPage_slug_key" ON "LegalPage" (
	"slug"
);
CREATE UNIQUE INDEX IF NOT EXISTS "News_slug_key" ON "News" (
	"slug"
);
CREATE UNIQUE INDEX IF NOT EXISTS "PasswordResetToken_token_key" ON "PasswordResetToken" (
	"token"
);
CREATE UNIQUE INDEX IF NOT EXISTS "SiteImage_key_key" ON "SiteImage" (
	"key"
);
COMMIT;
