'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types de commandes
interface Order {
  id: number;
  NumeroCommande: string;
  Nomclient: string;
  heureCommande: string;
  montant: number;
  ResumeCommande: string;
  Etat: string; 
}

interface OrderContextType {
  toValidateOrders: Order[];
  setToValidateOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  toCollectOrders: Order[];
  setToCollectOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  inProgressOrders: Order[];
  setInProgressOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  completedOrders: Order[];
  setCompletedOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  addToCollectOrders: (order: Order) => void; 
}

interface OrderProviderProps {
  children: ReactNode;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [toValidateOrders, setToValidateOrders] = useState<Order[]>([
   
    {
      id: 1,
      NumeroCommande: 'Com-38',
      Nomclient:'Client Ph',
      heureCommande: '16:00',
      montant: 100,
      ResumeCommande: 'Écran 65 pouces',
      Etat: 'en cours',
    },
    {
      id: 2,
      NumeroCommande: 'Com-39',
      Nomclient: 'Client X',
      heureCommande: '17:00',
      montant: 50,
      ResumeCommande: 'Téléphone 6 pouces',
      Etat: 'en cours',
    },
  ]);
  
  const [toCollectOrders, setToCollectOrders] = useState<Order[]>([]);
  const [inProgressOrders, setInProgressOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);

  const addToCollectOrders = (order: Order) => {
    setToCollectOrders(prevOrders => [...prevOrders, order]);
  };

  return (
    <OrderContext.Provider
      value={{
        toValidateOrders,
        setToValidateOrders,
        toCollectOrders,
        setToCollectOrders,
        inProgressOrders,
        setInProgressOrders,
        completedOrders,
        setCompletedOrders,
        addToCollectOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};
