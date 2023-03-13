console.log("Core.js");

let mainSection = document.getElementById("main");
let saveBtn = document.getElementById("btn-save-tabs");
let listBtn = document.getElementById("btn-list-tabs");

// Functions
const saveTabs = async () => {
  console.debug("Saving...");

  let queryOptions = { currentWindow: true };
  let result = await chrome.tabs.query(queryOptions);
  console.debug(result);

  let tabs = result.map(t => {
    return {
      url: t.url,
      title: t.title,
      icon: t.favIconUrl,
      groupId: t.windowId,
      isIncognito: t.incognito
    }
  });

  await addNewTabGroup(tabs);
  await renderTabSection(tabs);
}

const retrieveAllTabs = async () => {
  let allTabs = await chrome.storage.sync.get(["myTabsGroup"]);

  if (!allTabs.myTabsGroup) {
    allTabs.myTabsGroup = [];
  }

  return allTabs;
}

const addNewTabGroup = async (tabs) => {
  let allTabs = await retrieveAllTabs();

  let tabGroup = {
    id: tabs[0].groupId,
    tabs: tabs
  };
  allTabs.myTabsGroup.push(tabGroup);

  await chrome.storage.sync.set({
    myTabsGroup: allTabs.myTabsGroup
  });
}

const renderTabSection = async (gid, tabs) => {
  let groupId = gid ?? "empty";

  let tabSection = document.createElement("section");
  tabSection.className = "tabs";
  tabSection.dataset.groupId = groupId;

  let tabHeader = document.createElement("h2");
  tabHeader.textContent = groupId;
  tabSection.append(tabHeader);

  let tabUList = document.createElement("ul");

  tabs.forEach(tab => {
    let tabLItem = document.createElement("li");
    let tabAnchor = document.createElement("a");
    let tabImg = document.createElement("img");
    let tabSpan = document.createElement("span");
    
    tabSpan.textContent = tab.title;
    tabImg.setAttribute("src", tab.icon);
    tabAnchor.setAttribute("alt", tab.url);
    tabAnchor.setAttribute("title", tab.url);

    tabAnchor.append(tabImg);
    tabAnchor.append(tabSpan);
    tabLItem.append(tabAnchor);
    tabUList.append(tabLItem);
  });

  tabSection.append(tabUList);
  mainSection.append(tabSection);
}

// Event Listeners
saveBtn.addEventListener("click", saveTabs);
listBtn.addEventListener("click", () => {
  retrieveAllTabs()
    .then(allTabs => {
      allTabs?.myTabsGroup?.forEach(t => {
        renderTabSection(t.id, t.tabs);
      })
    });
});

// Raw
retrieveAllTabs()
  .then(allTabs => {
    allTabs?.myTabsGroup?.forEach(t => {
      renderTabSection(t.id, t.tabs);
    })
  });