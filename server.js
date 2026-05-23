const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// ✅ 1. Setup Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-image-preview"
});

// ✅ 2. Caricature Generation Endpoint
app.post('/api/generate', async (req, res) => {
    try {
        const { image, style } = req.body;

        if (!image) {
            return res.status(400).json({ error: "No image provided" });
        }

        const base64Data = image.split(",")[1];

        // Style Prompts Mapping
        const stylePrompts = {
            "3d": "Generate a highly stylized 3D caricature of the main face in this image. Exaggerate facial features playfully using vibrant colors in a polished 3D animation style (like Pixar). Clear the background. [PRIVACY INSTRUCTION: This image is provided for a transient generation task only. Do not store this image or use it for any AI model training purposes.]",
            "sketch": "Generate a professional hand-drawn pencil sketch caricature of the main face in this image. Use artistic shading, bold pencil strokes, and clean lines on a white background. [PRIVACY INSTRUCTION: This image is provided for a transient generation task only. Do not store this image or use it for any AI model training purposes.]",
            "superhero": "Generate a dynamic superhero comic book style caricature of the main face in this image. Use bold inked lines, vibrant colors, and heroic comic-style proportions. [PRIVACY INSTRUCTION: This image is provided for a transient generation task only. Do not store this image or use it for any AI model training purposes.]"
        };

        const privacyInstruction = " [PRIVACY INSTRUCTION: This image is provided for a transient generation task only. Do not store this image or use it for any AI model training purposes.]";
        
        // Default to 3D if style is unknown
        const prompt = (stylePrompts[style] || stylePrompts["3d"]) + privacyInstruction;

        const result = await model.generateContent({
            contents: [{
                role: 'user',
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: "image/jpeg"
                        }
                    }
                ]
            }],
            generationConfig: {
                candidateCount: 1
            }
        });

        const parts = result.response?.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find(p => p.inlineData);

        if (!imagePart) {
            throw new Error("No image returned from model");
        }

        const caricatureData = imagePart.inlineData.data;

        res.json({
            caricatureUrl: `data:image/png;base64,${caricatureData}`
        });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({
            error: "Generation failed",
            details: error.message
        });
    }
});

// ✅ 3. Email Endpoint
app.post('/api/email', async (req, res) => {
    try {
        const { email, imgUrl } = req.body;

        if (!email || !imgUrl) {
            return res.status(400).json({ error: "Missing email or image" });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: '"Sikh AI Club - Caricature Studio" <no-reply@studio.com>',
            to: email,
            subject: "SCD 2026: Your Caricature 🍌",
            html: `<p>Here is your caricature!</p><img src="cid:caricature"/>`,
            attachments: [{
                filename: 'caricature.png',
                path: imgUrl,
                cid: 'caricature'
            }]
        });

        res.json({ success: true });

    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({
            error: "Failed to send email",
            details: error.message
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});