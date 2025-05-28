"use client";
import * as React from 'react';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Crud, DataSourceCache } from '@toolpad/core/Crud';
import { usePathname, useRouter } from 'next/navigation';
import { Note, notesDataSource } from './actions';

const notesCache = new DataSourceCache();

function matchPath(pattern: string, pathname: string): string | null {
  const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, '([^/]+)')}$`);
  const match = pathname.match(regex);
  return match ? match[1] : null;
}

export default function CrudBasic() {

  const pathname = usePathname();
  // Remove this const when copying and pasting into your project.
  const title = React.useMemo(() => {
    if (pathname === '/dashboard/keys/new') {
      return 'New Note';
    }
    const editNoteId = matchPath('/dashboard/keys/:noteId/edit', pathname);
    if (editNoteId) {
      return `Note ${editNoteId} - Edit`;
    }
    const showNoteId = matchPath('/dashboard/keys/:noteId', pathname);
    if (showNoteId) {
      return `Note ${showNoteId}`;
    }

    return undefined;
  }, [pathname]);

  return (

      <Crud<Note>
        dataSource={notesDataSource}
        dataSourceCache={notesCache}
        rootPath="/dashboard/keys"
        initialPageSize={10}
        defaultValues={{ title: 'New note' }}
      />
  );
}
