// AdminPage.tsx
'use client';
import React, { useEffect, useState } from 'react';
import commandeService, { Commande } from '../../services/CommandeService';
import { useOrderContext } from '../OrderContext';

const AdminPage = () => {
  const {
    toValidateOrders,
    setToValidateOrders,
    inProgressOrders,
    setInProgressOrders,
    completedOrders,
    setCompletedOrders,
    addToCollectOrders,
  } = useOrderContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [notification, setNotification] = useState<string>('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const commandesData = await commandeService.getCommandesByEtat('avalider');
        setToValidateOrders(commandesData);

        const commandesEnCours = await commandeService.getCommandesByEtat('encours');
        setInProgressOrders(commandesEnCours);

        const commandesTerminees = await commandeService.getCommandesByEtat('termine');
        setCompletedOrders(commandesTerminees);
      } catch (error) {
        setError('Erreur lors de la récupération des commandes.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [setToValidateOrders, setInProgressOrders, setCompletedOrders]);

  const handleValidate = async (order: Commande) => {
    try {
      const validatedOrder = await commandeService.updateCommandeEtat(order.id, 'encours');
      setInProgressOrders((prev) => [...prev, validatedOrder]);
      setToValidateOrders((prev) => prev.filter((o) => o.id !== order.id));
      setNotification(`Commande ${order.NumeroCommande} validée avec succès.`);
    } catch {
      setError('Erreur lors de la validation de la commande.');
    }
  };

  const handleNotify = (order: Commande) => {
    addToCollectOrders(order);
    setNotification(`Commande ${order.NumeroCommande} a été notifiée.`);
  };

  const handleComplete = async (order: Commande) => {
    try {
      const completedOrder = await commandeService.updateCommandeEtat(order.id, 'termine');
      setCompletedOrders((prev) => [...prev, completedOrder]);
      setInProgressOrders((prev) => prev.filter((o) => o.id !== order.id));
      setNotification(`Commande ${order.NumeroCommande} terminée avec succès.`);
    } catch {
      setError('Erreur lors de la mise à jour de la commande.');
    }
  };

  return (
 <div className="w-full h-screen bg-gray-200 p-6">
  {notification && <div className="bg-green-500 text-white p-2 rounded mb-4">{notification}</div>}
  {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
    {/* Commandes à valider */}
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Commandes à valider</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {toValidateOrders.map((order) => (
            <div key={order.id} className="border p-4 rounded-lg bg-blue-100 mb-4">
              <p>{order.NumeroCommande} - {order.Nomclient}</p>
              <div className="flex justify-between mt-2">
                <button
                  className="bg-green-500 text-white py-1 px-4 rounded"
                  onClick={() => handleValidate(order)}
                >
                  Valider
                </button>
                <button
                  className="bg-yellow-500 text-white py-1 px-4 rounded"
                  onClick={() => handleNotify(order)}
                >
                  Notifier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Commandes en cours */}
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Commandes en cours</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inProgressOrders.map((order) => (
          <div key={order.id} className="border p-4 rounded-lg bg-yellow-100 mb-4">
            <p>{order.NumeroCommande} - {order.Nomclient}</p>
            <button
              className="bg-blue-500 text-white py-1 px-4 rounded"
              onClick={() => handleComplete(order)}
            >
              Terminer
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

  );
};

export default AdminPage;
