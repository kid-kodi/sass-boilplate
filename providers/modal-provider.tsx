"use client";

import { createContext, useContext, useState } from "react";

interface ModalProviderProps {
  children: React.ReactNode;
}

// export type ModalData = Record<string, unknown>;

interface ModalContextType {
  // data: ModalData;
  isOpen: boolean;
  setOpen: (
    modal: React.ReactNode
    // fetchData?: () => Promise<any>
  ) => Promise<void>;
  setClose: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [data, setData] = useState<ModalData>({});
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const setOpen = async (
    modal: React.ReactNode
    // fetchData?: () => Promise<any>
  ) => {
    if (!modal) return;

    // if (fetchData) {
    //   try {
    //     const fetchedData = await fetchData();
    //     setData(fetchedData || {});
    //   } catch (error) {
    //     console.error("Error fetching modal data:", error);
    //   }
    // }

    setModalContent(modal);
    setIsOpen(true);
  };

  const setClose = () => {
    setIsOpen(false);
    // setData({});
    setModalContent(null);
  };

  return (
    // <ModalContext.Provider value={{ data, isOpen, setOpen, setClose }}>
    <ModalContext.Provider value={{ isOpen, setOpen, setClose }}>
      {children}
      {modalContent}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export default ModalProvider;
