"use client";
import { Provider } from "react-redux";
import store from "@/app/redux/store";

const ClientProvider = ({children}) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default ClientProvider;
