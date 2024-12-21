import axios from 'axios';

export interface Commande {
  id: number;
  NumeroCommande: string;
  Nomclient: string;
  heureCommande: string;
  montant: number;
  ResumeCommande: string;
  Etat: string; 
}

const commandeService = {
  getOrders: async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/commandes');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }
  },

  getCommandesByEtat: async (etat: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/commandes/etat/${etat}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des commandes avec l'état ${etat}:`, error);
      throw error;
    }
  },

  updateCommandeEtat: async (orderId: number, newEtat: string) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/commandes/${orderId}`,
        { Etat: newEtat },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'état de la commande:', error);
      throw error;
    }
  },
};

export default commandeService;
