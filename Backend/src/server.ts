import express, { Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

import { authenticate, AuthRequest } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// Protected Routes Middleware
app.use('/api/devices', authenticate);
app.use('/api/packs', authenticate);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Kliiq Backend is running' });
});

// Device Routes
app.get('/api/devices', async (req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('devices')
            .select('*')
            .eq('user_id', req.user.id) // App-level isolation
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
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
app.patch('/api/devices/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_host } = req.body;

        if (is_host) {
            // Unset current host first (simple toggle logic)
            await supabase.from('devices').update({ is_host: false }).eq('is_host', true);
        }

        const { data, error } = await supabase
            .from('devices')
            .update({ is_host })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
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

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}

// Export for Vercel
export default app;
