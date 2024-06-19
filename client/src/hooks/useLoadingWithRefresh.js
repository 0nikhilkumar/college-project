import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";

export function useLoadingWithRefresh(){
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        (async ()=> {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/refresh`, {
                    withCredentials: true,
                });
                dispatch(setAuth(data))
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        })();
    }, []);
    return { loading };
}