import Head from "next/head";
import { ScriptProps } from "next/script";

export default function Seo({ title }: ScriptProps) {
  return (
    <Head>
      <title>{`${title}`}</title>
    </Head>
  );
}
