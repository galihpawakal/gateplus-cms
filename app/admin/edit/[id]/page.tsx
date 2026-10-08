'use client';

import { useParams } from 'next/navigation';
import { ContentEditor } from '../../ContentEditor';

export default function EditContentPage() {
  const params = useParams<{ id: string }>();
  return <ContentEditor contentId={params.id} />;
}