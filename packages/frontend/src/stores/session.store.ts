// packages/frontend/src/stores/session.store.ts

import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useConnectionsStore, type ConnectionInfo } from './connections.store';

// 从新模块导入状态
import {
  sessions,
  activeSessionId,
  isRdpModalOpen,
  rdpConnectionInfo,
  isVncModalOpen,
  vncConnectionInfo,
} from './session/state';

// 从新模块导入 Getters
import {
  sessionTabs,
  sessionTabsWithStatus,
  activeSession,
} from './session/getters';

// 从新模块导入 Actions
import * as sessionActions from './session/actions/sessionActions';
import * as editorActions from './session/actions/editorActions';
import * as sftpManagerActions from './session/actions/sftpManagerActions';
import * as modalActions from './session/actions/modalActions';
import * as commandInputActions from './session/actions/commandInputActions';

// 导入需要的类型 (例如 FileInfo 可能会在参数中使用)
import type { FileInfo } from './fileEditor.store';
// SftpManagerInstance 类型主要在 action 文件内部使用，但如果 store 直接暴露它，则需要导入
// import type { SftpManagerInstance } from './session/types';


export const useSessionStore = defineStore('session', () => {
  // --- 依赖 ---
  const { t } = useI18n();
  const connectionsStore = useConnectionsStore();
  const router = useRouter();

  // --- 包装 Actions 以注入依赖 ---

  // Modal Actions (这些可能被其他 actions 依赖，所以先定义)
  const openRdpModal = (connection: ConnectionInfo) => modalActions.openRdpModal(connection);
  const closeRdpModal = () => modalActions.closeRdpModal();
  const openVncModal = (connection: ConnectionInfo) => modalActions.openVncModal(connection);
  const closeVncModal = () => modalActions.closeVncModal();

  // Session Actions
  const openNewSession = (connectionId: number | string) =>
    sessionActions.openNewSession(connectionId, { connectionsStore, t });
  const activateSession = (sessionId: string) => sessionActions.activateSession(sessionId);
  const closeSession = (sessionId: string) => sessionActions.closeSession(sessionId);
  const handleConnectRequest = (connection: ConnectionInfo) =>
    sessionActions.handleConnectRequest(connection, {
      connectionsStore,
      router,
      openRdpModalAction: openRdpModal, // 传递包装后的 action
      openVncModalAction: openVncModal,   // 传递包装后的 action
      t,
    });
  const handleOpenNewSession = (connectionId: number | string) =>
    sessionActions.handleOpenNewSession(connectionId, { connectionsStore, t });
  const cleanupAllSessions = () => sessionActions.cleanupAllSessions();

  // SFTP Manager Actions
  const getOrCreateSftpManager = (sessionId: string, instanceId: string) =>
    sftpManagerActions.getOrCreateSftpManager(sessionId, instanceId, { t });
  const removeSftpManager = (sessionId: string, instanceId: string) =>
    sftpManagerActions.removeSftpManager(sessionId, instanceId);

  // Editor Actions
  const openFileInSession = (sessionId: string, fileInfo: FileInfo) =>
    editorActions.openFileInSession(sessionId, fileInfo, { getOrCreateSftpManager, t });
  const closeEditorTabInSession = (sessionId: string, tabId: string) =>
    editorActions.closeEditorTabInSession(sessionId, tabId);
  const setActiveEditorTabInSession = (sessionId: string, tabId: string) =>
    editorActions.setActiveEditorTabInSession(sessionId, tabId);
  const updateFileContentInSession = (sessionId: string, tabId: string, newContent: string) =>
    editorActions.updateFileContentInSession(sessionId, tabId, newContent);
  const saveFileInSession = (sessionId: string, tabId: string) =>
    editorActions.saveFileInSession(sessionId, tabId, { getOrCreateSftpManager, t });
  const changeEncodingInSession = (sessionId: string, tabId: string, newEncoding: string) =>
    editorActions.changeEncodingInSession(sessionId, tabId, newEncoding);
  const closeOtherTabsInSession = (sessionId: string, targetTabId: string) =>
    editorActions.closeOtherTabsInSession(sessionId, targetTabId);
  const closeTabsToTheRightInSession = (sessionId: string, targetTabId: string) =>
    editorActions.closeTabsToTheRightInSession(sessionId, targetTabId);
  const closeTabsToTheLeftInSession = (sessionId: string, targetTabId: string) =>
    editorActions.closeTabsToTheLeftInSession(sessionId, targetTabId);

  // Command Input Actions
  const updateSessionCommandInput = (sessionId: string, content: string) =>
    commandInputActions.updateSessionCommandInput(sessionId, content);


  return {
    // State (直接从 state 模块导出，Pinia 会处理)
    sessions,
    activeSessionId,
    isRdpModalOpen,
    rdpConnectionInfo,
    isVncModalOpen,
    vncConnectionInfo,

    // Getters (直接从 getters 模块导出)
    sessionTabs,
    sessionTabsWithStatus,
    activeSession,

    // Wrapped Actions
    openNewSession,
    activateSession,
    closeSession,
    handleConnectRequest,
    handleOpenNewSession,
    cleanupAllSessions,
    getOrCreateSftpManager,
    removeSftpManager,
    openFileInSession,
    closeEditorTabInSession,
    setActiveEditorTabInSession,
    updateFileContentInSession,
    saveFileInSession,
    changeEncodingInSession,
    closeOtherTabsInSession,
    closeTabsToTheRightInSession,
    closeTabsToTheLeftInSession,
    openRdpModal,
    closeRdpModal,
    openVncModal,
    closeVncModal,
    updateSessionCommandInput,
  };
});
