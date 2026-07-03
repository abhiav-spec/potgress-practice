import express from 'express';
import Redis from 'ioredis';

const app = express();
const port = 3000;

app.use(express.json());

// Create a Redis client
const redisClient = new Redis('redis://localhost:6379');
const BANNER_KEY = 'banner'; 

// Endpoint to get the banner
app.get('/banner', async (req, res) => {
    try {
        // Await the promise instead of using a callback
        const banner = await redisClient.get(BANNER_KEY);
        
        if (banner) {
            return res.json({ banner });
        } else {
            const fetchedBanner = 'Welcome to our website!'; // Simulated DB fetch
            // Cache the fetched banner in Redis for 1 hour
            await redisClient.setex(BANNER_KEY, 3600, fetchedBanner); 
            return res.json({ banner: fetchedBanner });
        }
    } catch (error) {
        console.error('Error fetching banner:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/banner', async (req, res) => {
    try {
        const { banner } = req.body;
        if (!banner) {
            return res.status(400).json({ error: 'Banner content is required' });
        }
        
        // Update DB (simulated) then cache
        await redisClient.setex(BANNER_KEY, 3600, banner); // Cache for 1 hour
        return res.json({ message: 'Banner updated successfully', banner });
    } catch (error) {
        console.error('Error updating banner:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/banner', async (req, res) => {
    try {
        // Delete the BANNER_KEY directly from Redis
        const response = await redisClient.del(BANNER_KEY);
        
        if (response === 1) {
            return res.json({ message: 'Banner deleted successfully' });
        } else {
            return res.status(404).json({ error: 'Banner not found' });
        }
    } catch (error) {
        console.error('Error deleting banner from Redis:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Corrected path and added await
app.get('/banner/exists', async (req, res) => {
    try {
        const existsCode = await redisClient.exists(BANNER_KEY);
        const exists = existsCode === 1; // Converts 0/1 to false/true
        res.json({ success: true, exists });
    } catch (error) {
        console.error('Error checking if banner exists:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
