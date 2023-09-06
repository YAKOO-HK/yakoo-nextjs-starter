import { Main } from '@/components/layout/Main';

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return <Main>{children}</Main>;
}
