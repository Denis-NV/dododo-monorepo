ALTER TABLE "user" 
ALTER COLUMN "recovery_code" 
SET DATA TYPE bytea
USING decode("recovery_code", 'escape');
