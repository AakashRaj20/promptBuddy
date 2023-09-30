import "@styles/globals.css";

import Nav from "@components/Nav";
import Provider from "@components/Provider";
import ReduxProvider from "@redux_store/ReduxProvider";
import Head from "next/head";

export const metadata = {
  title: "PromptBuddy",
  description: "Discover & Share AI Prompts",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <ReduxProvider>
        <Provider>
          <div className="main">
            <div className="gradient" />
          </div>

          <main className="app">
            <Nav />
            {children}
          </main>
        </Provider>
      </ReduxProvider>
    </body>
  </html>
);

export default RootLayout;
