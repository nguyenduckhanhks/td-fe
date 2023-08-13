import "./App.css";
import "./PhaserGame";
import Layout from "./layout";
import { AppProvider } from "./context";

function App() {
  return (
    <AppProvider>
      <div>
        <Layout>
          <div id="phaser-container" className="App"></div>
        </Layout>
      </div>
    </AppProvider>
  );
}

export default App;
