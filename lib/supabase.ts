import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
        console.error('Supabase credentials missing! Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env or Vercel settings.');
    }
}

// Export a dummy or real client, but ensure we don't crash the app boot
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
        realtime: {
            params: {
                eventsPerSecond: 10
            }
        }
    }
);

// Helper types
export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    username: string;
                    full_name: string;
                    avatar_url: string | null;
                    bio: string | null;
                    created_at: string;
                };
            };
            posts: {
                Row: {
                    id: string;
                    user_id: string;
                    content: string;
                    content_type: string;
                    media_urls: string[] | null;
                    likes_count: number;
                    comments_count: number;
                    shares_count: number;
                    created_at: string;
                    updated_at: string;
                };
            };
        };
    };
};
