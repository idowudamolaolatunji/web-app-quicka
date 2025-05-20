import React, { useEffect, useState } from "react";


export function useCheckInternetConnection() {
    const [isOnline,setIsOnline] = useState(navigator.onLine)

    const handleCheck = () =>{
        setIsOnline(navigator.onLine)
    }

    useEffect(function() {
        window.addEventListener("online", handleCheck)
        window.addEventListener("offline", handleCheck)
    }, [])

    return isOnline ? "online" : "offline" ;
};