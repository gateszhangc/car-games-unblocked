import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dcvdvohnuuighxgcklga.supabase.co";
const SUPABASE_SERVICE_ROLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjdmR2b2hudXVpZ2h4Z2NrbGdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDEzNzU5NywiZXhwIjoyMDc5NzEzNTk3fQ.gVQKBdiD8JwZL7-Eo0L5mfLOSMdsKX3hI0hhZ95CviM";

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
