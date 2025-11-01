-- Update dropdown_options to use movement_type instead of tracking_type
-- This aligns with the shots table column rename migration

-- Step 1: Drop the old CHECK constraint temporarily to allow the update
ALTER TABLE dropdown_options
DROP CONSTRAINT dropdown_options_field_name_check;

-- Step 2: Update the field_name in existing records
UPDATE dropdown_options
SET field_name = 'movement_type'
WHERE field_name = 'tracking_type';

-- Step 3: Add new CHECK constraint with movement_type instead of tracking_type
ALTER TABLE dropdown_options
ADD CONSTRAINT dropdown_options_field_name_check
CHECK (field_name = ANY (ARRAY['shot_type'::text, 'location_start_point'::text, 'movement_type'::text, 'subject'::text]));

-- Step 4: Verify the change
DO $$
DECLARE
  movement_count INTEGER;
  tracking_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO movement_count FROM dropdown_options WHERE field_name = 'movement_type';
  SELECT COUNT(*) INTO tracking_count FROM dropdown_options WHERE field_name = 'tracking_type';

  RAISE NOTICE 'Movement type options: %', movement_count;
  RAISE NOTICE 'Tracking type options (should be 0): %', tracking_count;

  IF tracking_count > 0 THEN
    RAISE WARNING 'Still have % tracking_type options - migration may have failed', tracking_count;
  END IF;

  IF movement_count = 0 THEN
    RAISE WARNING 'No movement_type options found - migration may have failed';
  END IF;
END $$;
