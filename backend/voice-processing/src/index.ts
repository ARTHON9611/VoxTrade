import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { NLPClient } from './services/nlp';

// Load environment variables
dotenv.config();

// Initialize clients
const speechClient = new SpeechClient();
const textToSpeechClient = new TextToSpeechClient();
const nlpClient = new NLPClient();

// Create Express server
const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'voice-processing' });
});

// Speech-to-text endpoint
app.post('/api/speech-to-text', async (req, res) => {
  try {
    const { audio, config } = req.body;
    
    if (!audio || !audio.content) {
      return res.status(400).json({ error: 'Missing audio content' });
    }
    
    const request = {
      audio: {
        content: audio.content,
      },
      config: {
        encoding: config?.encoding || 'LINEAR16',
        sampleRateHertz: config?.sampleRateHertz || 16000,
        languageCode: config?.languageCode || 'en-US',
      },
    };
    
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    
    res.status(200).json({ transcription });
  } catch (error) {
    console.error('Error in speech-to-text:', error);
    res.status(500).json({ error: 'Failed to process speech' });
  }
});

// Text-to-speech endpoint
app.post('/api/text-to-speech', async (req, res) => {
  try {
    const { text, voice, audioConfig } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing text' });
    }
    
    const request = {
      input: { text },
      voice: voice || {
        languageCode: 'en-US',
        ssmlGender: 'NEUTRAL',
      },
      audioConfig: audioConfig || {
        audioEncoding: 'MP3',
      },
    };
    
    const [response] = await textToSpeechClient.synthesizeSpeech(request);
    
    res.status(200).json({
      audioContent: response.audioContent.toString('base64'),
    });
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    res.status(500).json({ error: 'Failed to synthesize speech' });
  }
});

// Command processing endpoint
app.post('/api/process-command', async (req, res) => {
  try {
    const { command } = req.body;
    
    if (!command) {
      return res.status(400).json({ error: 'Missing command' });
    }
    
    // Process command using NLP service
    const result = await nlpClient.processCommand(command);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error processing command:', error);
    res.status(500).json({ error: 'Failed to process command' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Voice Processing Service listening on port ${port}`);
});

export default app;
