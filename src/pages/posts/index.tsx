import Head from "next/head";

import styles from "./styles.module.scss";

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>04 de Janeiro de 2022</time>
            <strong>Creating a Monorepo</strong>
            <p>In this guide, you will learn</p>
          </a>
          <a href="#">
            <time>04 de Janeiro de 2022</time>
            <strong>Creating a Monorepo</strong>
            <p>In this guide, you will learn</p>
          </a>
          <a href="#">
            <time>04 de Janeiro de 2022</time>
            <strong>Creating a Monorepo</strong>
            <p>In this guide, you will learn</p>
          </a>
        </div>
      </main>
    </>
  );
}