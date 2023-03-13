import { createSignal } from "solid-js";

const [getTabsGroups, setTabsGroups] = createSignal([]);
const [getMessage, setMessage] = createSignal(null);

const saveTabs = async () => {
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

    if (await addNewTabGroup(tabs)) {
        setTabsGroups((await retrieveAllTabs()).myTabsGroup);
    }
}

const retrieveAllTabs = async () => {
    let tgIDs = await chrome.storage.sync.get(["tabsGroupsIDs"]);
    let tgList = [];

    if (tgIDs && tgIDs.tabsGroupsIDs) {
        for (let tgID of tgIDs.tabsGroupsIDs) {
            let tg = await chrome.storage.sync.get([`${tgID}`]);
            tgList.push(tg[tgID]);
        }
    }

    return {
        myTabsGroup: tgList
    };
}

const addNewTabGroup = async (tabs) => {
    let allTabs = await retrieveAllTabs();

    let existingTabsGroups = allTabs.myTabsGroup.find(t => t.id == tabs[0].groupId);
    if (existingTabsGroups) {
        setMessage(`Tab group '${tabs[0].groupId}' is already saved.\nTo update, please, delete it and add it again.`);
        setTimeout(() => {
            setMessage(null);
        }, 3000);

        return false;
        // await removeTabsGroup(tabs[0].groupId);
    }

    let tabGroup = {
        id: tabs[0].groupId,
        tabs: tabs
    };
    allTabs.myTabsGroup.push(tabGroup);

    let tabGroupObject = {};
    tabGroupObject[tabs[0].groupId] = {
        id: tabs[0].groupId,
        tabs: tabs
    };

    await chrome.storage.sync.set({
        tabsGroupsIDs: allTabs.myTabsGroup.map(t => t.id)
    });
    await chrome.storage.sync.set(tabGroupObject);

    return true;
}

const removeTabsGroup = async (tgID) => {
    let tabsGroupsResult = await chrome.storage.sync.get(["tabsGroupsIDs"]);
    let index = tabsGroupsResult.tabsGroupsIDs.indexOf(tgID);

    tabsGroupsResult.tabsGroupsIDs.splice(index, 1);

    await chrome.storage.sync.set({
        tabsGroupsIDs: tabsGroupsResult.tabsGroupsIDs
    });

    let tabGroupObject = {};
    tabGroupObject[tgID] = null;
    await chrome.storage.sync.set(tabGroupObject);

    setTabsGroups((await retrieveAllTabs()).myTabsGroup);
}

const openTabsGroup = async (tgID) => {
    let tabsGroup = await chrome.storage.sync.get([`${tgID}`]);
    let tabs = tabsGroup[tgID].tabs;

    chrome.windows.create({
        focused: true,
        url: tabs.map(t => t.url)
    });
}

export { getMessage, getTabsGroups, openTabsGroup, removeTabsGroup, retrieveAllTabs, saveTabs, setTabsGroups };

