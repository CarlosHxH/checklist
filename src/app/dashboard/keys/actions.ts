import { DataModel, DataSource } from "@toolpad/core/Crud";

export interface Note extends DataModel {
  id: number;
  title: string;
  text: string;
}

export let notesStore: Note[] = [
  { id: 1, title: "Grocery List Item", text: "Buy more coffee." },
  { id: 2, title: "Personal Goal", text: "Finish reading the book." },
];

export const notesDataSource: DataSource<Note> = {
  fields: [
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "text", headerName: "Text", flex: 1 },
  ],

  getMany: async ({ paginationModel, filterModel, sortModel }) => {
    // Simulate loading delay
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    let processedNotes = [...notesStore];

    // Apply filters (demo only)
    if (filterModel?.items?.length) {
      filterModel.items.forEach(({ field, value, operator }) => {
        if (!field || value == null) {
          return;
        }

        processedNotes = processedNotes.filter((note) => {
          const noteValue = note[field];

          switch (operator) {
            case "contains":
              return String(noteValue)
                .toLowerCase()
                .includes(String(value).toLowerCase());
            case "equals":
              return noteValue === value;
            case "startsWith":
              return String(noteValue)
                .toLowerCase()
                .startsWith(String(value).toLowerCase());
            case "endsWith":
              return String(noteValue)
                .toLowerCase()
                .endsWith(String(value).toLowerCase());
            case ">":
              return (noteValue as number) > value;
            case "<":
              return (noteValue as number) < value;
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    if (sortModel?.length) {
      processedNotes.sort((a, b) => {
        for (const { field, sort } of sortModel) {
          if ((a[field] as number) < (b[field] as number)) {
            return sort === "asc" ? -1 : 1;
          }
          if ((a[field] as number) > (b[field] as number)) {
            return sort === "asc" ? 1 : -1;
          }
        }
        return 0;
      });
    }

    // Apply pagination
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginatedNotes = processedNotes.slice(start, end);

    return {
      items: paginatedNotes,
      itemCount: processedNotes.length,
    };
  },

  getOne: async (noteId) => {
    // Simulate loading delay
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    const noteToShow = notesStore.find((note) => note.id === Number(noteId));

    if (!noteToShow) {
      throw new Error("Note not found");
    }
    return noteToShow;
  },

  createOne: async (data) => {
    // Simulate loading delay
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    const newNote = {
      id: notesStore.reduce((max, note) => Math.max(max, note.id), 0) + 1,
      ...data,
    } as Note;

    notesStore = [...notesStore, newNote];

    return newNote;
  },

  updateOne: async (noteId, data) => {
    // Simulate loading delay
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    let updatedNote: Note | null = null;

    notesStore = notesStore.map((note) => {
      if (note.id === Number(noteId)) {
        updatedNote = { ...note, ...data };
        return updatedNote;
      }
      return note;
    });

    if (!updatedNote) {
      throw new Error("Note not found");
    }
    return updatedNote;
  },

  deleteOne: async (noteId) => {
    // Simulate loading delay
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    notesStore = notesStore.filter((note) => note.id !== Number(noteId));
  },

  validate: (formValues) => {
    let issues: { message: string; path: [keyof Note] }[] = [];

    if (!formValues.title) {
      issues = [...issues, { message: "Title is required", path: ["title"] }];
    }

    if (formValues.title && formValues.title.length < 3) {
      issues = [
        ...issues,
        {
          message: "Title must be at least 3 characters long",
          path: ["title"],
        },
      ];
    }

    if (!formValues.text) {
      issues = [...issues, { message: "Text is required", path: ["text"] }];
    }

    return { issues };
  },
};
