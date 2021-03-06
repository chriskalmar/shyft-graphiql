import Head from 'next/head';
import styles from '../styles/Home.module.css';
import GraphiQL from 'graphiql';
import { useEffect, useRef, useState } from 'react';
import 'graphiql/graphiql.css';
import GraphiQLExplorer from 'graphiql-explorer';
import { buildClientSchema, getIntrospectionQuery } from 'graphql';
import AuthDialog from '../src/AuthDialog';
import { getToken } from '../src/auth';
import { fetcher } from '../src/fetcher';
import getConfig from 'next/config';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

export default function Home() {
  const graphiqlEl = useRef(null);

  const [query, setQuery] = useState();
  const [schema, setSchema] = useState(null);
  const [explorerIsOpen, setExplorerIsOpen] = useState(true);
  const [authIsOpen, setAuthIsOpen] = useState(false);

  const fetchSchema = () => {
    fetcher({
      query: getIntrospectionQuery(),
    }).then((result) => {
      if (result?.data) {
        const schema = buildClientSchema(result.data);
        setSchema(schema);
      }
    });
  };

  useEffect(() => fetchSchema, []);

  const toggleExplorerIsOpen = () => {
    setExplorerIsOpen(!explorerIsOpen);
  };

  return (
    <div className="graphiql-container">
      <Head>
        <title>Shyft GraphiQL</title>
        {/* <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.59.2/theme/dracula.css"
        /> */}
      </Head>
      <GraphiQLExplorer
        schema={schema}
        query={query}
        onEdit={setQuery}
        onRunOperation={(operationName) =>
          graphiqlEl.current.handleRunQuery(operationName)
        }
        explorerIsOpen={explorerIsOpen}
        onToggleExplorer={toggleExplorerIsOpen}
      />
      <GraphiQL
        ref={graphiqlEl}
        fetcher={fetcher}
        schema={schema}
        query={query}
        onEditQuery={setQuery}
        // editorTheme={'dracula'}
      >
        <GraphiQL.Toolbar>
          <GraphiQL.Button
            onClick={() => graphiqlEl.current.handlePrettifyQuery()}
            label="Prettify"
            title="Prettify Query (Shift-Ctrl-P)"
          />
          <GraphiQL.Button
            onClick={() => graphiqlEl.current.handleToggleHistory()}
            label="History"
            title="Show History"
          />
          <GraphiQL.Button
            onClick={toggleExplorerIsOpen}
            label="Explorer"
            title="Toggle Explorer"
          />
          <GraphiQL.Button
            onClick={() => setAuthIsOpen(true)}
            label="Authentication"
            title="Show Authentication Dialog"
          />
          <GraphiQL.Button
            onClick={() => fetchSchema()}
            label="Refetch Schema"
            title="Refetch Schema"
          />
        </GraphiQL.Toolbar>
      </GraphiQL>
      <AuthDialog
        isOpen={authIsOpen}
        onClose={() => setAuthIsOpen(false)}
        fetcher={fetcher}
      />
    </div>
  );
}

export const getServerSideProps = () => {
  return {
    props: {},
  };
};
