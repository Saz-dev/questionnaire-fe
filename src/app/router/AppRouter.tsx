import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ResearchPage } from '@/pages/ResearchPage'
import { RetrievalPage } from '@/pages/RetrievalPage'
import { KnowledgeBasePage } from '@/pages/KnowledgeBasePage'
import { SystemPage } from '@/pages/SystemPage'
import { EvalsPage } from '@/pages/EvalsPage'

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <ResearchPage /> },
      { path: '/retrieval', element: <RetrievalPage /> },
      { path: '/knowledge-base', element: <KnowledgeBasePage /> },
      { path: '/evals', element: <EvalsPage /> },
      { path: '/system', element: <SystemPage /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
