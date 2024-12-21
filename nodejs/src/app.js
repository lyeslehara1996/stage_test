const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

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

app.get("/api/commandes", (req, res) => {
  res.json(commandes);
});

app.get("/api/commandes/etat/:etat", (req, res) => {
  const etat = req.params.etat.toLowerCase();

  const commandesFiltrees = commandes.filter(
    (commande) => commande.Etat.toLowerCase() === etat
  );

  if (commandesFiltrees.length === 0) {
    return res
      .status(404)
      .json({ message: `Aucune commande trouvée pour l'état "${etat}"` });
  }

  res.json(commandesFiltrees);
});

app.post("/api/commandes", (req, res) => {
  console.log(commandes);
  const newCommande = req.body;
  newCommande.id = commandes.length + 1;
  commandes.push(newCommande);
  res.status(201).json(newCommande);
});

app.put("/api/commandes/:id/notify", (req, res) => {
  const id = parseInt(req.params.id);
  const commande = commandes.find((c) => c.id === id);

  if (!commande) {
    return res.status(404).json({ message: "Commande non trouvée" });
  }

  commande.Etat = "notifiée";

  io.emit("commandesChanged", commandes);

  res.status(200).json(commande);
});

app.post("/api/commandes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { Etat } = req.body;

  const commande = commandes.find((c) => c.id === id);

  if (!commande) {
    return res.status(404).json({ message: "Commande non trouvée" });
  }

  commande.Etat = Etat;

  res.status(200).json(commande);
});

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

app.post("/api/commandes/import", (req, res) => {
  console.log("Requête reçue sur /api/commandes/import");
  const commandesImportees = req.body;
  console.log("Commandes importées :", commandesImportees);

  if (!Array.isArray(commandesImportees)) {
    return res
      .status(400)
      .json({ message: "Le format attendu est un tableau d'objets." });
  }

  commandesImportees.forEach((commande) => {
    commande.id = commandes.length + 1;
    commandes.push(commande);
  });

  res.status(201).json({ message: "Importation réussie", commandes });
});

app.delete("/api/commandes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const commandeIndex = commandes.findIndex((c) => c.id === id);

  if (commandeIndex === -1) {
    return res.status(404).json({ message: "Commande non trouvée" });
  }

  commandes.splice(commandeIndex, 1);
  res.status(204).end();
});

io.on("connection", (socket) => {
  console.log("Nouvelle connexion avec un client");

  socket.on("ajouterCommande", (newCommande) => {
    commandes.push(newCommande);
    io.emit("commandesChanged", commandes);
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
