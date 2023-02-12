import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { store } from "../redux/store";
import { Provider } from "react-redux";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </QueryClientProvider>
  );
}
