import Head from 'next/head';
import styles from '../styles/Home.module.css';
import GraphiQL from 'graphiql';
import { useEffect, useRef, useState } from 'react';
import 'graphiql/graphiql.css';
import GraphiQLExplorer from 'graphiql-explorer';
import { buildClientSchema, getIntrospectionQuery } from 'graphql';
import AuthDialog from '../src/AuthDialog';
import { getToken } from '../src/auth';

const fetcher = (params) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (!params.authMode && getToken()) {
    headers.Authorization = `JWT ${getToken()}`;
  }

  return fetch(
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
    {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    },
  )
    .then((response) => {
      return response.text();
    })
    .then((body) => {
      try {
        return JSON.parse(body);
      } catch (e) {
        return body;
      }
    });
};

export default function Home() {
  const graphiqlEl = useRef(null);

  const [query, setQuery] = useState();
  const [schema, setSchema] = useState(null);
  const [explorerIsOpen, setExplorerIsOpen] = useState(true);
  const [authIsOpen, setAuthIsOpen] = useState(false);

  useEffect(() => {
    fetcher({
      query: getIntrospectionQuery(),
    }).then((result) => {
      const schema = buildClientSchema(result.data);
      setSchema(schema);
    });
  }, []);

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
