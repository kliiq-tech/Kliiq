import express, { Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

import { authenticate, AuthRequest } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Supabase Configuration
// Using SERVICE_ROLE key to bypass RLS since we handle authorization at the app level
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

app.use(cors({
    origin: [
        'https://kliiq-web.vercel.app',
        'https://kliiq.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
}));
app.use(express.json());

// Protected Routes Middleware
app.use('/api/devices', authenticate);
app.use('/api/packs', authenticate);
app.use('/api/settings', authenticate);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Kliiq Backend is running' });
});

// Device Routes
app.get('/api/devices', async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        console.log('=== DEVICES ENDPOINT DEBUG ===');
        console.log('Full user object:', JSON.stringify(req.user, null, 2));
        console.log('User ID from JWT:', userId);

        // First, let's see ALL devices in the database
        const { data: allDevices } = await supabase
            .from('devices')
            .select('*');
        console.log('Total devices in DB:', allDevices?.length);
        console.log('All device user_ids:', allDevices?.map(d => d.user_id));

        // Now query with the user_id filter
        const { data, error } = await supabase
            .from('devices')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        console.log('Filtered devices count:', data?.length);
        console.log('Query error:', error);
        console.log('=== END DEBUG ===');

        if (error) throw error;
        res.json(data || []);
    } catch (error: any) {
        console.error('Error fetching devices:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/devices', async (req: AuthRequest, res: Response) => {
    try {
        const { name, type, os, specs } = req.body;
        const user_id = req.user.id; // Get from JWT

        const { data, error } = await supabase
            .from('devices')
            .insert([{ name, type, os, specs, user_id, status: 'online' }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update Device (e.g. Host change)
app.patch('/api/devices/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { is_host } = req.body;
        const user_id = req.user.id;

        if (is_host) {
            // Unset current host first for THIS USER ONLY
            await supabase
                .from('devices')
                .update({ is_host: false })
                .eq('user_id', user_id)
                .eq('is_host', true);
        }

        const { data, error } = await supabase
            .from('devices')
            .update({ is_host })
            .eq('id', id)
            .eq('user_id', user_id) // Security: Ensure user owns device
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Settings & Security Routes
app.post('/api/settings/admin-password', async (req: AuthRequest, res: Response) => {
    try {
        const { password } = req.body;
        const user_id = req.user.id;

        // Store in User Metadata (simple solution for now)
        const { data, error } = await supabase.auth.admin.updateUserById(
            user_id,
            { user_metadata: { admin_password: password } }
        );

        if (error) throw error;
        res.json({ message: 'Admin password set successfully' });
    } catch (error: any) {
        console.error('Error setting password:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/settings/verify-password', async (req: AuthRequest, res: Response) => {
    try {
        const { password } = req.body;
        const user_id = req.user.id;

        const { data: { user }, error } = await supabase.auth.admin.getUserById(user_id);
        if (error) throw error;

        const storedPassword = user?.user_metadata?.admin_password;
        if (!storedPassword) return res.status(400).json({ error: 'No admin password set' });

        if (password === storedPassword) {
            res.json({ valid: true });
        } else {
            res.status(401).json({ valid: false, error: 'Incorrect password' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Remove Device
app.delete('/api/devices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('devices').delete().eq('id', id);
        if (error) throw error;
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Pack Routes
app.get('/api/packs', async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { data, error } = await supabase
            .from('packs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data || []);
    } catch (error: any) {
        console.error('Error fetching packs:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/packs', async (req: AuthRequest, res: Response) => {
    try {
        const { name, app_ids } = req.body;
        const user_id = req.user.id;

        const { data, error } = await supabase
            .from('packs')
            .insert([{ name, app_ids: app_ids || [], user_id, status: 'draft' }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error: any) {
        console.error('Error creating pack:', error);
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/packs/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const { name, app_ids } = req.body;

        // Verify pack belongs to user
        const { data: pack } = await supabase
            .from('packs')
            .select('user_id')
            .eq('id', id)
            .single();

        if (!pack || pack.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const updateData: any = { updated_at: new Date().toISOString() };
        if (name) updateData.name = name;
        if (app_ids !== undefined) updateData.app_ids = app_ids;

        const { data, error } = await supabase
            .from('packs')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        console.error('Error updating pack:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/packs/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        // Verify pack belongs to user
        const { data: pack } = await supabase
            .from('packs')
            .select('user_id')
            .eq('id', id)
            .single();

        if (!pack || pack.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { error } = await supabase
            .from('packs')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(204).send();
    } catch (error: any) {
        console.error('Error deleting pack:', error);
        res.status(500).json({ error: error.message });
    }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}

// Export for Vercel
export default app;
