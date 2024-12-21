'use client';

import React from 'react';
import { useOrderContext } from '../OrderContext';

const TvScreenPage = () => {
  const { toCollectOrders, inProgressOrders, completedOrders } = useOrderContext();

  return (
    <div className="w-full h-screen bg-gray-200 flex justify-center items-center p-4">
      <div className="grid grid-cols-3 gap-6 w-full max-w-7xl h-full">
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-xl font-bold mb-4">Merci de venir encaisser</h2>
          <div className="space-y-4">
            {toCollectOrders.map((order) => (
              <div key={order.id} className="border p-4 rounded-lg bg-blue-100">
                <p className="text-lg font-semibold">Commande : {order.NumeroCommande}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-xl font-bold mb-4">En cours</h2>
          <div className="space-y-4">
            {inProgressOrders.map((order) => (
              <div key={order.id} className="border p-4 rounded-lg bg-yellow-100">
                <p className="text-lg font-semibold">Commande : {order.NumeroCommande}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-xl font-bold mb-4">Terminé</h2>
          <div className="space-y-4">
            {completedOrders.map((order) => (
              <div key={order.id} className="border p-4 rounded-lg bg-green-100">
                <p className="text-lg font-semibold">Commande : {order.NumeroCommande}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvScreenPage;
