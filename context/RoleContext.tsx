import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

type RoleContextType = {
  role: string;
  setRole: Dispatch<SetStateAction<string>>;
};

const defaultRoleContext: RoleContextType = {
  role: 'Studierende',
  setRole: () => {},
};

export const RoleContext = createContext<RoleContextType>(defaultRoleContext);

type RoleProviderProps = {
  children: ReactNode;
};

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [role, setRole] = useState<string>('Studierende');

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
