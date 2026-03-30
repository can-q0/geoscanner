-- Replace custom JWT auth with Clerk
ALTER TABLE "users" ADD COLUMN "clerk_id" VARCHAR(255);
UPDATE "users" SET "clerk_id" = 'pending_migration_' || "id" WHERE "clerk_id" IS NULL;
ALTER TABLE "users" ALTER COLUMN "clerk_id" SET NOT NULL;
ALTER TABLE "users" ADD CONSTRAINT "users_clerk_id_key" UNIQUE ("clerk_id");
ALTER TABLE "users" DROP COLUMN "password_hash";
