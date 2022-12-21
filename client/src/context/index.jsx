import React, { useContext, createContext } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0xa8FD7F75CA1e26C3E6d6969bcDf0267A2820990F"
  );

  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address, //address of the person who is creating the campaign
        form.title, //title of the campaign
        form.description, //description of the campaign
        form.target, //target fund raise amount of the campaign
        new Date(form.deadline).getTime(), //deadline for raising funds for the campaign
        form.image, //image representative of the campaign
      ]);
      console.log("Contract call success", data);
    } catch (error) {
      console.log("Contract call error", error);
      console.log(
        address,
        form.title,
        form.description,
        form.target,
        form.deadline,
        form.image
      );
    }
  };

  return (
    <StateContext.Provider
      value={{ address, contract, connect, createCampaign: publishCampaign }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
