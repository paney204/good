const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors()); // Autoriser les requêtes depuis ton frontend

const upload = multer({ dest: "uploads/" });

app.post("/send-email", upload.single("pdfFile"), async (req, res) => {
    try {
        // Configurer Nodemailer
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "tonemail@gmail.com",
                pass: "tonmotdepasse"
            }
        });

        let mailOptions = {
            from: "tonemail@gmail.com",
            to: "destinataire@email.com",
            subject: "Nouveau fichier PDF reçu",
            text: "Un utilisateur a soumis un fichier PDF.",
            attachments: [
                {
                    filename: req.file.originalname,
                    path: req.file.path
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        fs.unlinkSync(req.file.path);
        res.send("E-mail envoyé avec succès !");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de l'envoi.");
    }
});

app.get("/", (req, res) => {
    res.send("Serveur fonctionne !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en ligne sur le port ${PORT}`));
