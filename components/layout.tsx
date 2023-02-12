import Footer from "./footer";
import Header from "./header";

interface Props {
  children: JSX.Element[] | JSX.Element;
}

function Layout({ children }: Props) {
  return (
    <div>
      <Header />
      {children}
      <Footer></Footer>
    </div>
  );
}

export default Layout;
