import "@styles/globals.css";

import Nav from "@components/Nav";
import Provider from "@components/Provider";
import ReduxProvider from "@redux_store/ReduxProvider";
import ThemeProviders from "@components/ThemeProviders";

export const metadata = {
  title: "PromptBuddy",
  description: "Discover & Share AI Prompts",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <ReduxProvider>
        <Provider>
          <ThemeProviders>
            <div className="main">
              <div className="gradient" />
            </div>

            <main className="app">
              <Nav />
              {children}
            </main>
          </ThemeProviders>
        </Provider>
      </ReduxProvider>
    </body>
  </html>
);

export default RootLayout;
