-- CreateTable
CREATE TABLE "PlatformConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteName" TEXT NOT NULL DEFAULT 'Green Axis S.A.S.',
    "siteUrl" TEXT,
    "siteSlogan" TEXT,
    "siteDescription" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "companyName" TEXT,
    "companyAddress" TEXT,
    "companyPhone" TEXT,
    "companyEmail" TEXT,
    "notificationEmail" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "twitterUrl" TEXT,
    "linkedinUrl" TEXT,
    "tiktokUrl" TEXT,
    "youtubeUrl" TEXT,
    "footerText" TEXT,
    "socialText" TEXT DEFAULT 'Síguenos en nuestras redes',
    "whatsappNumber" TEXT,
    "whatsappMessage" TEXT DEFAULT '¡Hola! Me gustaría obtener información sobre sus servicios ambientales.',
    "whatsappShowBubble" BOOLEAN NOT NULL DEFAULT true,
    "aboutImageUrl" TEXT,
    "aboutTitle" TEXT DEFAULT 'Comprometidos con el futuro del planeta',
    "aboutDescription" TEXT,
    "aboutYearsExperience" TEXT DEFAULT '15',
    "aboutYearsText" TEXT DEFAULT 'Años protegiendo el medio ambiente',
    "aboutStats" TEXT,
    "aboutFeatures" TEXT,
    "aboutSectionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "aboutBadge" TEXT DEFAULT 'Sobre Nosotros',
    "aboutBadgeColor" TEXT DEFAULT '#6BBE45',
    "showMapSection" BOOLEAN NOT NULL DEFAULT true,
    "metaKeywords" TEXT,
    "googleAnalytics" TEXT,
    "googleMapsEmbed" TEXT,
    "primaryColor" TEXT DEFAULT '#6BBE45',
    "portfolioEnabled" BOOLEAN NOT NULL DEFAULT false,
    "portfolioTitle" TEXT DEFAULT 'Descarga Nuestro Portafolio Corporativo',
    "portfolioUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "shortBlocks" TEXT,
    "content" TEXT,
    "blocks" TEXT,
    "icon" TEXT,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "showSummary" BOOLEAN NOT NULL DEFAULT true,
    "portfolioEnabled" BOOLEAN NOT NULL DEFAULT false,
    "portfolioTitle" TEXT DEFAULT 'Descarga el Portafolio de Servicios Ambientales',
    "portfolioUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "author" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "blocks" TEXT,
    "showCoverInContent" BOOLEAN NOT NULL DEFAULT true,
    "imageCaption" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "category" TEXT,
    "hash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CarouselSlide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "buttonText" TEXT,
    "buttonUrl" TEXT,
    "linkUrl" TEXT,
    "gradientEnabled" BOOLEAN NOT NULL DEFAULT true,
    "animationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "gradientColor" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LegalPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "blocks" TEXT,
    "manualDate" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SocialFeedConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "embedCode" TEXT,
    "accessToken" TEXT,
    "pageId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AboutPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "heroTitle" TEXT DEFAULT 'Quiénes Somos',
    "heroSubtitle" TEXT DEFAULT 'Comprometidos con el medio ambiente',
    "heroImageUrl" TEXT,
    "historyTitle" TEXT DEFAULT 'Nuestra Historia',
    "historyContent" TEXT,
    "historyImageUrl" TEXT,
    "missionTitle" TEXT DEFAULT 'Nuestra Misión',
    "missionContent" TEXT,
    "visionTitle" TEXT DEFAULT 'Nuestra Visión',
    "visionContent" TEXT,
    "valuesTitle" TEXT DEFAULT 'Nuestros Valores',
    "valuesContent" TEXT,
    "teamTitle" TEXT DEFAULT 'Nuestro Equipo',
    "teamEnabled" BOOLEAN NOT NULL DEFAULT false,
    "teamMembers" TEXT,
    "whyChooseTitle" TEXT DEFAULT '¿Por Qué Elegirnos?',
    "whyChooseContent" TEXT,
    "ctaTitle" TEXT DEFAULT '¿Listo para trabajar con nosotros?',
    "ctaSubtitle" TEXT DEFAULT 'Contáctanos y descubre cómo podemos ayudarte',
    "ctaButtonText" TEXT DEFAULT 'Contáctanos',
    "ctaButtonUrl" TEXT DEFAULT '/contacto',
    "statsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "statsContent" TEXT,
    "certificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "certificationsContent" TEXT,
    "showLocationSection" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SiteImage_key_key" ON "SiteImage"("key");

-- CreateIndex
CREATE UNIQUE INDEX "LegalPage_slug_key" ON "LegalPage"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");
