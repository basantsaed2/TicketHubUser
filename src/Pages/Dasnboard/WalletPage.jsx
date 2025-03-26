import React, { useState, useEffect } from "react";
import { useGet } from "../../Hooks/useGet";
const WalletPage = () => {
     const apiUrl = import.meta.env.VITE_API_BASE_URL;
      // Fetch profile data from your API
      const { refetch: refetchWallet, data: walletData } = useGet({
        url: `${apiUrl}/user/wallet`,
      });
    const [wallet, setWallet] = useState({});
    
    useEffect(() => {
        refetchWallet();
    }, [refetchWallet]);
    
    useEffect(() => {
        if (walletData && walletData.wallet) {
        console.log("wallet Data:", walletData);
        setWallet(walletData.wallet);
        }
    }, [walletData]);
    
    return (
        <div>
           
        </div>
    );
}
export default WalletPage;