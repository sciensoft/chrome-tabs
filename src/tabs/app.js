import { For, Show, createEffect } from 'solid-js';
import { render } from 'solid-js/web';

import Footer from './components/footer';
import Header from './components/header';
import { getMessage, getTabsGroups, openTabsGroup, removeTabsGroup, retrieveAllTabs, setTabsGroups } from './functions';

const TabsList = (props) => {
  return (
    <ul>
      <For each={props.tabs}>
        {(tab, _) =>
          <li>
            <a href={tab.url} alt={tab.url} title={tab.url} target='_blank'>
              <img src={tab.icon} alt={tab.url} title={tab.url} />
              <span>{tab.title}</span>
            </a>
          </li>
        }
      </For>
    </ul>
  )
}

const TabsGroups = (props) => {
  return (
    <For each={props.tgroups}>
      {(tg, _) =>
        <section class="tabs" data-group-id={tg.id}>
          <h2>{tg.id}</h2>
          <TabsList tabs={tg.tabs} />
          <div class="options">
            <a className="btn btn-delete" onClick={() => removeTabsGroup(tg.id)}>Delete</a>
            <a className="btn btn-open" onClick={() => openTabsGroup(tg.id)}>Open</a>
          </div>
        </section>
      }
    </For>
  );
}

const App = () => {
  createEffect(async () => {
    let allTabs = await retrieveAllTabs();
    setTabsGroups(allTabs.myTabsGroup);
  });

  return (
    <>
      <Header />

      <main id="main">
        <TabsGroups tgroups={getTabsGroups()} />
        <Show
          when={getMessage()}>
          <div class="messages">{getMessage()}</div>
        </Show>
      </main>

      <Footer />
    </>
  );
}

render(() => <App />, document.getElementById('main-app'))
