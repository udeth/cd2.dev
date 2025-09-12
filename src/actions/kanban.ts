import type { SWRConfiguration } from 'swr';
import type { UniqueIdentifier } from '@dnd-kit/core';
import type { IKanban, IKanbanTask, IKanbanColumn } from 'src/types/kanban';

import useSWR, { mutate } from 'swr';
import { useMemo, startTransition } from 'react';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const enableServer = false;

const KANBAN_ENDPOINT = endpoints.kanban;

const swrOptions: SWRConfiguration = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

type BoardData = {
  data: {
    board: IKanban;
  };
};

export function useGetBoard() {
  const { data, isLoading, error, isValidating } = useSWR<BoardData>(KANBAN_ENDPOINT, fetcher, {
    ...swrOptions,
  });

  const memoizedValue = useMemo(() => {
    const tasks = data?.data.board.tasks ?? {};
    const columns = data?.data.board.columns ?? [];

    return {
      board: { tasks, columns },
      boardLoading: isLoading,
      boardError: error,
      boardValidating: isValidating,
      boardEmpty: !isLoading && !isValidating && !columns.length,
    };
  }, [data?.data.board.columns, data?.data.board.tasks, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createColumn(columnData: IKanbanColumn) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnData };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'create-column' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: BoardData | undefined) => {
      if (!currentData) return currentData;
      const board = currentData.data.board;

      // add new column in board.columns
      const columns = [...board.columns, columnData];

      // add new task in board.tasks
      const tasks = { ...board.tasks, [columnData.id]: [] };

      return { ...currentData, data: { ...currentData.data, board: { ...board, columns, tasks } } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateColumn(columnId: UniqueIdentifier, columnName: string) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, columnName };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'update-column' } });
  }

  /**
   * Work in local
   */
  startTransition(() => {
    mutate(
      KANBAN_ENDPOINT,
      (currentData: BoardData | undefined) => {
        if (!currentData) return currentData;
        const board = currentData.data.board;

        const columns = board.columns.map((column) =>
          column.id === columnId
            ? {
                // Update data when found
                ...column,
                name: columnName,
              }
            : column
        );

        return { ...currentData, data: { ...currentData.data, board: { ...board, columns } } };
      },
      false
    );
  });
}

// ----------------------------------------------------------------------

export async function moveColumn(updateColumns: IKanbanColumn[]) {
  /**
   * Work in local
   */
  startTransition(() => {
    mutate(
      KANBAN_ENDPOINT,
      (currentData: BoardData | undefined) => {
        if (!currentData) return currentData;
        const board = currentData.data.board;

        return { ...currentData, data: { ...currentData.data, board: { ...board, columns: updateColumns } } };
      },
      false
    );
  });

  /**
   * Work on server
   */
  if (enableServer) {
    const data = { updateColumns };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'move-column' } });
  }
}

// ----------------------------------------------------------------------

export async function clearColumn(columnId: UniqueIdentifier) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'clear-column' } });
  }

  /**
   * Work in local
   */
  startTransition(() => {
    mutate(
      KANBAN_ENDPOINT,
      (currentData: BoardData | undefined) => {
        if (!currentData) return currentData;
        const board = currentData.data.board;

        // remove all tasks in column
        const tasks = { ...board.tasks, [columnId]: [] };

        return { ...currentData, data: { ...currentData.data, board: { ...board, tasks } } };
      },
      false
    );
  });
}

// ----------------------------------------------------------------------

export async function deleteColumn(columnId: UniqueIdentifier) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'delete-column' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: BoardData | undefined) => {
      if (!currentData) return currentData;
      const board = currentData.data.board;

      // delete column in board.columns
      const columns = board.columns.filter((column) => column.id !== columnId);

      // delete tasks by column deleted
      const tasks = Object.keys(board.tasks)
        .filter((key) => key !== columnId)
        .reduce((obj: IKanban['tasks'], key) => {
          obj[key] = board.tasks[key];
          return obj;
        }, {});

      return { ...currentData, data: { ...currentData.data, board: { ...board, columns, tasks } } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createTask(columnId: UniqueIdentifier, taskData: IKanbanTask) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskData };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'create-task' } });
  }

  /**
   * Work in local
   */
  startTransition(() => {
    mutate(
      KANBAN_ENDPOINT,
      (currentData: BoardData | undefined) => {
        if (!currentData) return currentData;
        const board = currentData.data.board;

        // add task in board.tasks
        const tasks = { ...board.tasks, [columnId]: [taskData, ...board.tasks[columnId]] };

        return { ...currentData, data: { ...currentData.data, board: { ...board, tasks } } };
      },
      false
    );
  });
}

// ----------------------------------------------------------------------

export async function updateTask(columnId: UniqueIdentifier, taskData: IKanbanTask) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskData };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'update-task' } });
  }

  /**
   * Work in local
   */
  startTransition(() => {
    mutate(
      KANBAN_ENDPOINT,
      (currentData: BoardData | undefined) => {
        if (!currentData) return currentData;
        const board = currentData.data.board;

        // tasks in column
        const tasksInColumn = board.tasks[columnId];

        // find and update task
        const updateTasks = tasksInColumn.map((task) =>
          task.id === taskData.id
            ? {
                // Update data when found
                ...task,
                ...taskData,
              }
            : task
        );

        const tasks = { ...board.tasks, [columnId]: updateTasks };

        return { ...currentData, data: { ...currentData.data, board: { ...board, tasks } } };
      },
      false
    );
  });
}

// ----------------------------------------------------------------------

export async function moveTask(updateTasks: IKanban['tasks']) {
  /**
   * Work in local
   */
  startTransition(() => {
    mutate(
      KANBAN_ENDPOINT,
      (currentData: BoardData | undefined) => {
        if (!currentData) return currentData;
        const board = currentData.data.board;

        // update board.tasks
        const tasks = updateTasks;

        return { ...currentData, data: { ...currentData.data, board: { ...board, tasks } } };
      },
      false
    );
  });

  /**
   * Work on server
   */
  if (enableServer) {
    const data = { updateTasks };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'move-task' } });
  }
}

// ----------------------------------------------------------------------

export async function deleteTask(columnId: UniqueIdentifier, taskId: UniqueIdentifier) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskId };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'delete-task' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData: BoardData | undefined) => {
      if (!currentData) return currentData;
      const board = currentData.data.board;

      // delete task in column
      const tasks = {
        ...board.tasks,
        [columnId]: board.tasks[columnId].filter((task) => task.id !== taskId),
      };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}
