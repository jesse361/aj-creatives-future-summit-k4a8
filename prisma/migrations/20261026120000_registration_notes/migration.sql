ALTER TABLE "Registration" ADD COLUMN "privacyAccepted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Registration" ADD COLUMN "marketingConsent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Registration" ADD COLUMN "dietaryNotes" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Registration" ADD COLUMN "accessibilityNotes" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Registration" ADD COLUMN "studentVerification" TEXT NOT NULL DEFAULT '';
