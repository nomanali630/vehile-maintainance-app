import React, { useContext, useState, useEffect } from "react";
import axios from 'axios'
import url from './../components/BaseUrl'
const GlobalStateContext = React.createContext()
const GlobalStateUpdateContext = React.createContext()

export const useGlobalState = () => useContext(GlobalStateContext)
export const useGlobalStateUpdate = () => useContext(GlobalStateUpdateContext)

export function GlobalStateProvider({ children }) {
    const [data, setData] = useState({
        user: null,
        role: null,
        userProfile: null,
    })
    useEffect(() => {
        axios({
            method: "get",
            url: url + "/profile",
            withCredentials: true
        }).then((res) => {
            console.log("context response", res.data.profile);

            if (res.data.status === 200) {

                setData((prev) => ({
                    ...prev,
                    user: res.data.profile,
                    role: res.data.profile.role
                }))
            }
        }).catch((err) => {
            return setData((prev) => ({ ...prev, role: "loggedout" }));
        })

        return () => {
            console.log("cleanup");
        }
    }, []);

    return (
        <GlobalStateContext.Provider value={data}>
            <GlobalStateUpdateContext.Provider value={setData}>
                {children}
            </GlobalStateUpdateContext.Provider>
        </GlobalStateContext.Provider>
    )
}