const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

// Initialisation de l'application Express et du serveur HTTP
const app = express();
const server = http.createServer(app);

// Initialisation de Socket.io avec configuration CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // URL de votre frontend
    methods: ["GET", "POST"],
  },
});

// Configuration de CORS pour permettre les requêtes de votre frontend
app.use(
  cors({
    origin: "http://localhost:3000", // L'URL de votre frontend, ajustez-le selon vos besoins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Exemple de données de commandes (stockées en mémoire pour l'exemple)
let commandes = [
  {
    id: 1,
    NumeroCommande: "Com-34",
    heureCommande: "12:00",
    Nomclient: "Client A",
    montant: 100,
    ResumeCommande: "Écran 55 pouces",
    Etat: "avalider",
  },
  {
    id: 2,
    NumeroCommande: "Com-35",
    heureCommande: "14:00",
    Nomclient: "Client B",
    montant: 200,
    ResumeCommande: "Écran 40 pouces",
    Etat: "encours",
  },
  {
    id: 3,
    NumeroCommande: "Com-36",
    heureCommande: "1:00",
    Nomclient: "Client C",
    montant: 200,
    ResumeCommande: "Écran 20 pouces",
    Etat: "encours",
  },
  {
    id: 4,
    NumeroCommande: "Com-37",
    heureCommande: "13:00",
    Nomclient: "Client B",
    montant: 250,
    ResumeCommande: "Écran 30 pouces",
    Etat: "avalider",
  },
  {
    id: 5,
    NumeroCommande: "Com-38",
    heureCommande: "19:00",
    Nomclient: "Client D",
    montant: 350,
    ResumeCommande: "Écran 40 pouces",
    Etat: "avalider",
  },
  {
    id: 6,
    NumeroCommande: "Com-39",
    heureCommande: "21:00",
    Nomclient: "Client E",
    montant: 200,
    ResumeCommande: "Écran 20 pouces",
    Etat: "encours",
  },
  {
    id: 7,
    NumeroCommande: "Com-40",
    heureCommande: "14:00",
    Nomclient: "Client B",
    montant: 200,
    ResumeCommande: "Écran 40 pouces",
    Etat: "encours",
  },
  {
    id: 8,
    NumeroCommande: "Com-41",
    heureCommande: "11:00",
    Nomclient: "Client D",
    montant: 200,
    ResumeCommande: "Écran 40 pouces",
    Etat: "encours",
  },
  {
    id: 9,
    NumeroCommande: "Com-42",
    heureCommande: "15:00",
    Nomclient: "Client D",
    montant: 210,
    ResumeCommande: "Écran 40 pouces",
    Etat: "termine",
  },
];

// Route GET pour récupérer toutes les commandes
app.get("/api/commandes", (req, res) => {
  res.json(commandes);
});

// Route GET pour récupérer les commandes par état
app.get("/api/commandes/etat/:etat", (req, res) => {
  const etat = req.params.etat.toLowerCase(); // Récupérer l'état de la commande depuis l'URL

  // Filtrer les commandes par l'état
  const commandesFiltrees = commandes.filter(
    (commande) => commande.Etat.toLowerCase() === etat
  );

  // Si aucune commande n'est trouvée pour cet état, retourner un message approprié
  if (commandesFiltrees.length === 0) {
    return res
      .status(404)
      .json({ message: `Aucune commande trouvée pour l'état "${etat}"` });
  }

  // Retourner les commandes filtrées
  res.json(commandesFiltrees);
});

// Route POST pour ajouter une nouvelle commande
app.post("/api/commandes", (req, res) => {
  console.log(commandes);
  const newCommande = req.body; // Données de la nouvelle commande envoyées par le frontend
  newCommande.id = commandes.length + 1; // Générer un nouvel ID pour la commande
  commandes.push(newCommande); // Ajouter la commande à la liste
  res.status(201).json(newCommande); // Retourner la commande ajoutée
});

app.put("/api/commandes/:id/notify", (req, res) => {
  const id = parseInt(req.params.id);
  const commande = commandes.find((c) => c.id === id);

  if (!commande) {
    return res.status(404).json({ message: "Commande non trouvée" });
  }

  // Mettre à jour l'état de la commande en 'notifiée'
  commande.Etat = "notifiée";

  // Envoyer l'événement Socket.io pour notifier tous les clients
  io.emit("commandesChanged", commandes);

  res.status(200).json(commande);
});

// Route PUT pour mettre à jour une commande existante
// Route POST pour mettre à jour une commande par ID avec un nouvel état
app.post("/api/commandes/:id", (req, res) => {
  const id = parseInt(req.params.id); // Récupérer l'ID depuis l'URL
  const { Etat } = req.body; // Récupérer l'état depuis le corps de la requête

  const commande = commandes.find((c) => c.id === id);

  if (!commande) {
    return res.status(404).json({ message: "Commande non trouvée" });
  }

  // Mettre à jour l'état de la commande
  commande.Etat = Etat;

  res.status(200).json(commande); // Retourner la commande mise à jour
});

// Route pour imprimer une commande
app.get("/api/commandes/:id/print", (req, res) => {
  const id = parseInt(req.params.id);
  const commande = commandes.find((c) => c.id === id);

  if (!commande) {
    return res.status(404).json({ message: "Commande non trouvée" });
  }

  const printContent = `
      Commande N°: ${commande.NumeroCommande}
      Client: ${commande.Nomclient}
      Heure: ${commande.heureCommande}
      Montant: ${commande.montant} EUR
      Résumé: ${commande.ResumeCommande}
      État: ${commande.Etat}
    `;

  console.log("Impression de la commande :\n", printContent);

  res.json({ message: "Commande imprimée avec succès", printContent });
});

// Route pour importer des commandes
app.post("/api/commandes/import", (req, res) => {
  console.log("Requête reçue sur /api/commandes/import"); // Ajoutez ce log pour vérifier
  const commandesImportees = req.body; // Les données envoyées
  console.log("Commandes importées :", commandesImportees); // Vérifiez les données dans la console

  if (!Array.isArray(commandesImportees)) {
    return res
      .status(400)
      .json({ message: "Le format attendu est un tableau d'objets." });
  }

  commandesImportees.forEach((commande) => {
    commande.id = commandes.length + 1; // Ajoutez un ID unique
    commandes.push(commande); // Ajoutez à la liste des commandes
  });

  res.status(201).json({ message: "Importation réussie", commandes });
});

// Route DELETE pour supprimer une commande
app.delete("/api/commandes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const commandeIndex = commandes.findIndex((c) => c.id === id);

  if (commandeIndex === -1) {
    return res.status(404).json({ message: "Commande non trouvée" });
  }

  // Supprimer la commande
  commandes.splice(commandeIndex, 1);
  res.status(204).end();
});

// Connexion à Socket.io pour permettre la communication en temps réel
io.on("connection", (socket) => {
  console.log("Nouvelle connexion avec un client");

  // Exemple de communication en temps réel (notifier tous les clients lorsque la liste des commandes change)
  socket.on("ajouterCommande", (newCommande) => {
    commandes.push(newCommande);
    io.emit("commandesChanged", commandes); // Envoyer la mise à jour des commandes à tous les clients connectés
  });

  // Déconnexion
  socket.on("disconnect", () => {
    console.log("Client déconnecté");
  });
});

// Définir le port du serveur
const port = 3001;

// Lancer le serveur
server.listen(port, () => {
  console.log(`Serveur backend en écoute sur http://localhost:${port}`);
});
